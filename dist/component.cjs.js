"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const t=Symbol("__run__"),e=Symbol("__root__"),r=Symbol("__tag__"),o=Symbol("__render__"),s=/^(\w+)-(\w+)$/,n=Symbol("__state__"),i=Symbol("__store__"),a={enumerable:!1,configurable:!1,writable:!1};function c(t,e=i,r){return t.reflector=r||this.requestUpdate.bind(this),Object.defineProperty(this,e,{...a,value:t}),!0}function u(t,e=n,r){const o=this,s=new Proxy({...t},{get(t,e){const r=t[e];if(r)return r.value},set(t,e,s){const n=t[e];if(n&&n.value!==s){if(n.type&&typeof s!=typeof n.type())throw new Error(`Wrong type of propery "${e}".`);return n.value=s,"function"==typeof r?r(s,e):o.requestUpdate&&o.requestUpdate(s,e),!0}return!1}});Object.defineProperty(this,e,{...a,value:s})}function d(){const t=this;Object.defineProperty(t,"ref",{...a,value:new Proxy({},{get:(r,o)=>t[e].querySelector('[ref="'+o+'"]')})})}class l extends HTMLElement{static set tag(t){if(!s.test(t))throw new Error("Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ");this[r]=t}static get tag(){return this[r]}static get mode(){return"open"}static set render(t){"function"==typeof t&&(this[o]=t)}get state(){return this[n]||null}get store(){return this[i]||null}get root(){return this[e]}constructor(...r){super(r);const{state:s,mode:n,mixins:i,store:a}=this.constructor;if("function"!=typeof this.constructor[o])throw new Error('Renderer is undefined. For example set "lit-html" render function');n&&"string"==typeof n&&(this[e]=this.attachShadow({mode:n})),d.call(this),s&&"object"==typeof s&&u.call(this,s),a&&"object"==typeof a&&c.call(this,a),Array.isArray(i)&&i.forEach(t=>t.created&&t.created.apply(this,r)),l[t](["created"],this)}static mount(t=document.body,e=!0){if(t instanceof HTMLElement&&t.insertAdjacentHTML){if(e&&document.querySelector(this.tag))return;t.insertAdjacentHTML("beforeend",`<${this.tag} />`)}}static define(t,e){return window.customElements.get(t)?module&&module.hot&&module.hot.status&&"apply"===module.hot.status()&&Array.from(document.querySelectorAll(t)).forEach(t=>{Object.setPrototypeOf(t,e.prototype),t.requestUpdate&&t.requestUpdate()}):(this.tag=t,window.customElements.define(t,e)),this}static[t](t,e,r){t.forEach(t=>e[t]&&"function"==typeof e[t]&&e[t].apply(e,r))}adoptedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.moved&&t.moved.call(this)),l[t](["moved","requestUpdate"],this)}connectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.mounted&&t.mounted.call(this)),l[t](["mounted","requestUpdate"],this)}disconnectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.unmounted&&t.unmounted.call(this)),l[t](["unmounted"],this)}requestUpdate(){const e=this.shadowRoot||this.root||this,r=this.constructor[o];return new Promise((o,s)=>{try{l[t](["beforeUpdate"],this);const s=((e,r,o,s)=>n=>{e(r(n,o,{eventContext:s})),l[t](["afterUpdate"],s)})(o,r,e,this),n=this.render?this.render():"";n instanceof Promise?n.then(s):s(n)}catch(t){s("Render failed",t.message)}})}}exports.__state__=n,exports.__store__=i,exports.attachStore=c,exports.createState=u,exports.default=l;
//# sourceMappingURL=component.cjs.js.map
