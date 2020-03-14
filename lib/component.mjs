const __run__ = Symbol('__run__')
const __root__ = Symbol('__root__')
const __tag__ = Symbol('__tag__')
const __render__ = Symbol('__render__')

const isTagName = /^(\w+)-(\w+)$/

export const __state__ = Symbol('__state__')
export const __store__ = Symbol('__store__')

const __readonly__ = {
  enumerable: false,
  configurable: false,
  writable: false
}

/**
 * Attach global store
 * @param store 
 * @param property 
 * @returns {Boolean}
 */
export function attachStore(store, property = __store__, onChange) {
  // eslint-disable-next-line no-param-reassign
  store.reflector = onChange || this.requestUpdate.bind(this)
  Object.defineProperty(this, property, {
    ...__readonly__,
    value: store
  })
  return true
}

/**
 * Create local state of component. State changes initiate re-render
 * @param state 
 * @param property 
 * @param onChange 
 */
export function createState(state, property = __state__, onChange) {
  const self = this
  const value = new Proxy({
    ...state
  }, {
    /**
     * 
     * @param target 
     * @param key 
     */
    get(target, key) {
      const property = target[key]
      if (property) {
        return property.value
      }
      return undefined
    },
    /**
     * 
     * @param target 
     * @param key 
     * @param value 
     */
    set(target, key, value) {
      const property = target[key]
      if (property && property.value !== value) {
        if (property.type && typeof value !== typeof property.type()) {
          throw new Error(`Wrong type of propery "${key}".`)
        }
        property.value = value
        if (typeof onChange === 'function') {
          onChange(value, key)
        } else if (self.requestUpdate) {
          self.requestUpdate(value, key)
        }
        return true
      }
      return false
    }
  })

  Object.defineProperty(this, property, {
    ...__readonly__,
    value
  })
}


export default class Component extends HTMLElement {
  static set tag(value) {
    if (isTagName.test(value)) {
      this[__tag__] = value
    } else {
      throw new Error('Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ')
    }
  }

  static get tag() {
    return this[__tag__]
  }

  static get mode() {
    return 'open'
  }

  /**
   * @param {Function} func
   */
  static set render(func) {
    if (typeof func === 'function') {
      this[__render__] = func
    }
  }

  /**
   * @returns {Object|null}
   */
  get state() {
    return this[__state__] || null
  }

  /**
   * @returns {Object|null}
   */
  get store() {
    return this[__store__] || null
  }

  /**
   * 
   * @param args 
   */
  constructor(...args) {
    super(args)

    const { state, mode, mixins, store } = this.constructor

    if (typeof this.constructor[__render__] !== 'function') {
      throw new Error('Renderer is undefined. For example set "lit-html" render function')
    }

    if (mode && typeof mode === 'string') {
      this[__root__] = this.attachShadow({
        mode
      })
    }

    if (state && typeof state === 'object') {
      createState.call(this, state)
    }

    if (store && typeof store === 'object') {
      attachStore.call(this, store)
    }

    if (Array.isArray(mixins)) {
      mixins.forEach(mixin => mixin.created && mixin.created.apply(this, args))
    }

    Component[__run__](['created'], this)
  }

  /**
   * 
   * @param {String} tag 
   * @param {HTMLElement} point
   * @param {Boolean} once 
   */
  static mound(tag, point = document.body, once = true) {
    if (point instanceof HTMLElement && point.insertAdjacentHTML) {
      if (once && document.querySelector(tag)) {
        return
      }
      point.insertAdjacentHTML('beforeend', `<${tag} />`)
    }
    return
  }

  /**
  * 
  * @param name 
  * @param cls 
  * @param hot 
  */
  static define(name, cls) {
    if (!window.customElements.get(name)) {
      this.tag = name
      window.customElements.define(name, cls)
    }
    /** nativepack.ignore */
    // eslint-disable-next-line no-undef
    else if (module && module.hot && module.hot.status && module.hot.status() === 'apply') { // Hot Module Replacement
      Array
        .from(document.querySelectorAll(name))
        .forEach(node => {
          // Swap prototype of instance with new one
          // https://github.com/polleverywhere/hmr-custom-element
          Object.setPrototypeOf(node, cls.prototype)
          // re-render
          if (node.requestUpdate) {
            node.requestUpdate()
          }
        })
    }
    /** nativepack.ignore */
    return cls
  }

  /**
   * Component Lifecycles
   * @param lifeCycles 
   * @param instance 
   * @param args 
   */
  static [__run__](lifeCycles, instance, args) {
    lifeCycles.forEach(
      lifeCycle => instance[lifeCycle]
        && typeof instance[lifeCycle] === 'function'
        // eslint-disable-next-line prefer-spread
        && instance[lifeCycle].apply(instance, args)
    )
  }

  connectedCallback() {
    const { mixins } = this.constructor

    if (Array.isArray(mixins)) {
      mixins.forEach(mixin => mixin.mounted && mixin.mounted.call(this))
    }

    Component[__run__](['mounted', 'requestUpdate'], this)
  }

  // Call unmount
  disconnectedCallback() {
    const { mixins } = this.constructor

    if (Array.isArray(mixins)) {
      mixins.forEach(mixin => mixin.unmounted && mixin.unmounted.call(this))
    }

    Component[__run__](['requestUpdate', 'unmounted'], this)
  }

  /**
   * Trigger re-render of element
   */
  requestUpdate() {
    const container = this.shadowRoot || this[__root__] || this
    const renderer = this.constructor[__render__]
    return new Promise((resolve, reject) => {
      if (this.render) {
        resolve(renderer(this.render(), container, {
          eventContext: this
        }))
      } else {
        reject(new Error('Render method is missing'))
      }
    })
  }
}
