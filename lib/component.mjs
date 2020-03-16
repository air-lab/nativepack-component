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
 * 
 * @param resolve 
 * @param renderer 
 * @param container 
 * @param eventContext 
 */
const resolveRender = (resolve, renderer, container, eventContext) => template => {
  resolve(renderer(template, container, {
    eventContext
  }))
  Component[__run__](['afterUpdate'], eventContext)
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

/**
 * 
 */
function bindRef() {
  const self = this
  Object.defineProperty(self, 'ref', {
    ...__readonly__,
    value: new Proxy({}, {
      get(target, name) {
        return self[__root__].querySelector('[ref="' + name + '"]')
      }
    })
  })
}

/**
 * 
 */
export default class Component extends HTMLElement {
  static set tagName(value) {
    if (isTagName.test(value)) {
      this[__tag__] = value
    } else {
      throw new Error('Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ')
    }
  }

  static get tagName() {
    return this[__tag__]
  }

  static get mode() {
    return undefined
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

  get root() {
    return this[__root__]
  }

  /**
   * 
   * @param args 
   */
  constructor(...args) {
    super(args)

    const { state, mode, mixins, store, tagName } = this.constructor

    if (!isTagName.test(tagName)) {
      throw new Error('Static property tagName is required')
    }

    if (typeof this.constructor[__render__] !== 'function') {
      throw new Error('Renderer is undefined. For example set "lit-html" render function')
    }

    if (['open', 'closed'].includes(mode)) {
      this[__root__] = this.attachShadow({
        mode
      })
    }

    bindRef.call(this)

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
  static mount(point = document.body, once = true) {
    if (point instanceof HTMLElement && point.insertAdjacentHTML && this.tagName) {
      if (once && document.querySelector(this.tagName)) {
        return
      }
      point.insertAdjacentHTML('beforeend', `<${this.tagName} />`)
    } else {
      throw new Error('Static property tagName is required')
    }
  }

  /**
  * 
  * @param name 
  * @param cls 
  * @param hot 
  */
  static define(name) {
    this.tagName = name
    if (!window.customElements.get(name)) {
      window.customElements.define(name, this)
    }
    /** nativepack.ignore */
    // eslint-disable-next-line no-undef
    else if (module && module.hot && module.hot.status && module.hot.status() === 'apply') { // Hot Module Replacement
      Array
        .from(document.querySelectorAll(name))
        .forEach(node => {
          // Swap prototype of instance with new one
          // https://github.com/polleverywhere/hmr-custom-element
          Object.setPrototypeOf(node, this.prototype)
          // re-render
          if (node.requestUpdate) {
            node.requestUpdate()
          }
        })
    }
    /** nativepack.ignore */
    return this
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

  adoptedCallback() {
    const { mixins } = this.constructor

    if (Array.isArray(mixins)) {
      mixins.forEach(mixin => mixin.moved && mixin.moved.call(this))
    }

    Component[__run__](['moved', 'requestUpdate'], this)
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

    Component[__run__](['unmounted'], this)
  }

  /**
   * Trigger re-render of element
   */
  requestUpdate() {
    const container = this.shadowRoot || this.root || this
    const renderer = this.constructor[__render__]

    return new Promise((resolve, reject) => {
      try {
        Component[__run__](['beforeUpdate'], this)

        const render = resolveRender(resolve, renderer, container, this)
        const template = this.render ? this.render() : ''

        if (template instanceof Promise) {
          template.then(render)
        } else {
          render(template)
        }
      } catch (error) {
        reject('Render failed', error.message)
      }
    })
  }
}
