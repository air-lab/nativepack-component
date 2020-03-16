!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).Component={})}(this,(function(t){"use strict";const e=Symbol("__run__"),o=Symbol("__root__"),r=Symbol("__tag__"),n=Symbol("__render__"),s=/^(\w+)-(\w+)$/,i=Symbol("__state__"),a=Symbol("__store__"),c={enumerable:!1,configurable:!1,writable:!1};function u(t,e=a,o){return t.reflector=o||this.requestUpdate.bind(this),Object.defineProperty(this,e,{...c,value:t}),!0}function d(t,e=i,o){const r=this,n=new Proxy({...t},{get(t,e){const o=t[e];if(o)return o.value},set(t,e,n){const s=t[e];if(s&&s.value!==n){if(s.type&&typeof n!=typeof s.type())throw new Error(`Wrong type of propery "${e}".`);return s.value=n,"function"==typeof o?o(n,e):r.requestUpdate&&r.requestUpdate(n,e),!0}return!1}});Object.defineProperty(this,e,{...c,value:n})}function l(){const t=this;Object.defineProperty(t,"ref",{...c,value:new Proxy({},{get:(e,r)=>t[o].querySelector('[ref="'+r+'"]')})})}class f extends HTMLElement{static set tag(t){if(!s.test(t))throw new Error("Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ");this[r]=t}static get tag(){return this[r]}static get mode(){return"open"}static set render(t){"function"==typeof t&&(this[n]=t)}get state(){return this[i]||null}get store(){return this[a]||null}get root(){return this[o]}constructor(...t){super(t);const{state:r,mode:s,mixins:i,store:a}=this.constructor;if("function"!=typeof this.constructor[n])throw new Error('Renderer is undefined. For example set "lit-html" render function');s&&"string"==typeof s&&(this[o]=this.attachShadow({mode:s})),l.call(this),r&&"object"==typeof r&&d.call(this,r),a&&"object"==typeof a&&u.call(this,a),Array.isArray(i)&&i.forEach(e=>e.created&&e.created.apply(this,t)),f[e](["created"],this)}static mount(t=document.body,e=!0){if(t instanceof HTMLElement&&t.insertAdjacentHTML){if(e&&document.querySelector(this.tag))return;t.insertAdjacentHTML("beforeend",`<${this.tag} />`)}}static define(t,e){return window.customElements.get(t)?module&&module.hot&&module.hot.status&&"apply"===module.hot.status()&&Array.from(document.querySelectorAll(t)).forEach(t=>{Object.setPrototypeOf(t,e.prototype),t.requestUpdate&&t.requestUpdate()}):(this.tag=t,window.customElements.define(t,e)),this}static[e](t,e,o){t.forEach(t=>e[t]&&"function"==typeof e[t]&&e[t].apply(e,o))}adoptedCallback(){const{mixins:t}=this.constructor;Array.isArray(t)&&t.forEach(t=>t.moved&&t.moved.call(this)),f[e](["moved","requestUpdate"],this)}connectedCallback(){const{mixins:t}=this.constructor;Array.isArray(t)&&t.forEach(t=>t.mounted&&t.mounted.call(this)),f[e](["mounted","requestUpdate"],this)}disconnectedCallback(){const{mixins:t}=this.constructor;Array.isArray(t)&&t.forEach(t=>t.unmounted&&t.unmounted.call(this)),f[e](["unmounted"],this)}requestUpdate(){const t=this.shadowRoot||this.root||this,o=this.constructor[n];return new Promise((r,n)=>{try{f[e](["beforeUpdate"],this);const n=((t,o,r,n)=>s=>{t(o(s,r,{eventContext:n})),f[e](["afterUpdate"],n)})(r,o,t,this),s=this.render?this.render():"";s instanceof Promise?s.then(n):n(s)}catch(t){n("Render failed",t.message)}})}}t.__state__=i,t.__store__=a,t.attachStore=u,t.createState=d,t.default=f,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=component.umd.js.map
