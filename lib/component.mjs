/**
 * Copyright (c) 2020-present, Yan Zhabin.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const __run__ = Symbol('__run__')
const __root__ = Symbol('__root__')
const __render__ = Symbol('__render__')
const __mounted__ = Symbol('__mounted__')

const isTagName = /^(\w+)-(\w+)$/

const method = {
  validate: Symbol('validate'),
  check: Symbol('check'),
  init: Symbol('init')
}

export const __state__ = Symbol('__state__')
export const __store__ = Symbol('__store__')

const __readonly__ = {
  enumerable: false,
  configurable: false,
  writable: false
}

/**
 * 
 * @param func 
 */
function isFunc(func) {
  return func && typeof func === 'function'
}

/**
 * 
 * @param val1 
 * @param val2 
 */
function isEqual(val1, val2) {
  if (Object.is(val1, val2)) return true
  if (isFunc(val1) && isFunc(val2)) return val1.toString() === val2.toString()
  if (Object.is(JSON.stringify(val1), JSON.stringify(val2))) return true
  return false
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
      if (typeof property === 'object' && Object.prototype.hasOwnProperty.call(property, 'value')) {
        return property.value
      }
      return undefined
    },

    /**
     * 
     * @param target 
     * @param key 
     */
    deleteProperty(target, key) {
      delete target[key]
      self.requestUpdate(undefined, key)
      return true
    },
    /**
     * 
     * @param target 
     * @param key 
     * @param value 
     */
    set(target, key, value) {
      const property = target[key]
      if (typeof property === 'object' && !isEqual(property.value, value)) {
        if (property.type && typeof value !== typeof property.type()) {
          throw new TypeError(`Wrong type of property "${key}".`)
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

    const { state } = this.constructor

    this[method.check]()
    this[method.validate](state)
    this[method.init](...args)

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
  static define() {
    const name = this.tagName

    if (!isTagName.test(name)) {
      throw new Error('Static property tagName is required')
    }

    if (!window.customElements.get(name)) {
      window.customElements.define(name, this)
    }
    /** nativepack.ignore */
    // eslint-disable-next-line no-undef
    else if (module && module.hot) { // Hot Module Replacement
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
   * Component life-cycles
   * @param lifeCycles 
   * @param instance 
   * @param args 
   */
  static [__run__](lifeCycles, instance, args) {
    lifeCycles.forEach(
      lifeCycle => instance[lifeCycle]
        && isFunc(instance[lifeCycle])
        // eslint-disable-next-line prefer-spread
        && instance[lifeCycle].apply(instance, args)
    )
  }

  /**
   * 
   */
  [method.check]() {
    const { mode, tagName } = this.constructor

    if (!isTagName.test(tagName)) {
      throw new Error('Static property tagName is required')
    }

    if (typeof this.constructor[__render__] !== 'function') {
      console.warn('Renderer is undefined. For example you can use "lit-html" render function')
    }

    if (['open', 'closed'].includes(mode)) {
      this[__root__] = this.attachShadow({
        mode
      })
    }
  }

  /**
   * 
   */
  [method.init](...args) {
    const { state, store, mixins } = this.constructor

    this[__mounted__] = false

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
  }

  /**
   * Validate state types
   */
  [method.validate](state = {}) {
    if (!state) return
    const keys = Object.keys(state)
    for (const key of keys) {
      const property = state[key]

      if (property.type && typeof property.value !== typeof property.type()) {
        throw new TypeError(`Wrong type of property "${key}".`)
      }
    }
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

    if (window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this)
    }

    this[__mounted__] = true

    if (Array.isArray(mixins)) {
      mixins.forEach(mixin => mixin.mounted && mixin.mounted.call(this))
    }

    Component[__run__](['mounted', 'requestUpdate'], this)
  }

  /**
   * Optimize update
   * @param args 
   */
  attributeChangedCallback(...args) {
    const [, oldValue, value] = args

    if (this[__mounted__] && !isEqual(oldValue, value)) {
      Component[__run__](['update', 'requestUpdate'], this, ...args)
    }
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
  async requestUpdate() {
    const container = this.shadowRoot || this.root || this
    const { __render__: renderer, styles } = this.constructor

    await Component[__run__](['beforeUpdate'], this)

    const template = await this.render()
    const stylesTemplate = `<style>${this.constructor.styles}</style>`

    if (renderer) {
      if (String(styles).trim() && Array.isArray(template.strings)) {
        const patched = [stylesTemplate, ...template.strings]
        patched.raw = [stylesTemplate, ...template.strings.raw]
        template.strings = patched
      }

      await renderer(template, container, {
        eventContext: this
      })
    } else if (typeof template === 'string') {
      container.innerHTML = styles + template
    }

    Component[__run__](['afterUpdate'], this)
  }
}
