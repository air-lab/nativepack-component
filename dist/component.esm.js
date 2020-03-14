const t=Symbol("__run__"),e=Symbol("__root__"),r=Symbol("__tag__"),o=Symbol("__render__"),n=/^(\w+)-(\w+)$/,s=Symbol("__state__"),i=Symbol("__store__"),a={enumerable:!1,configurable:!1,writable:!1};function c(t,e=i,r){return t.reflector=r||this.requestUpdate.bind(this),Object.defineProperty(this,e,{...a,value:t}),!0}function u(t,e=s,r){const o=this,n=new Proxy({...t},{get(t,e){const r=t[e];if(r)return r.value},set(t,e,n){const s=t[e];if(s&&s.value!==n){if(s.type&&typeof n!=typeof s.type())throw new Error(`Wrong type of propery "${e}".`);return s.value=n,"function"==typeof r?r(n,e):o.requestUpdate&&o.requestUpdate(n,e),!0}return!1}});Object.defineProperty(this,e,{...a,value:n})}class d extends HTMLElement{static set tag(t){if(!n.test(t))throw new Error("Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ");this[r]=t}static get tag(){return this[r]}static get mode(){return"open"}static set render(t){"function"==typeof t&&(this[o]=t)}get state(){return this[s]||null}get store(){return this[i]||null}get root(){return this[e]}constructor(...r){super(r);const{state:n,mode:s,mixins:i,store:a}=this.constructor;if("function"!=typeof this.constructor[o])throw new Error('Renderer is undefined. For example set "lit-html" render function');s&&"string"==typeof s&&(this[e]=this.attachShadow({mode:s})),n&&"object"==typeof n&&u.call(this,n),a&&"object"==typeof a&&c.call(this,a),Array.isArray(i)&&i.forEach(t=>t.created&&t.created.apply(this,r)),d[t](["created"],this)}static mount(t=document.body,e=!0){if(t instanceof HTMLElement&&t.insertAdjacentHTML){if(e&&document.querySelector(this.tag))return;t.insertAdjacentHTML("beforeend",`<${this.tag} />`)}}static define(t,e){return window.customElements.get(t)?module&&module.hot&&module.hot.status&&"apply"===module.hot.status()&&Array.from(document.querySelectorAll(t)).forEach(t=>{Object.setPrototypeOf(t,e.prototype),t.requestUpdate&&t.requestUpdate()}):(this.tag=t,window.customElements.define(t,e)),this}static[t](t,e,r){t.forEach(t=>e[t]&&"function"==typeof e[t]&&e[t].apply(e,r))}connectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.mounted&&t.mounted.call(this)),d[t](["mounted","requestUpdate"],this)}disconnectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.unmounted&&t.unmounted.call(this)),d[t](["unmounted","requestUpdate"],this)}requestUpdate(){const e=this.shadowRoot||this.root||this,r=this.constructor[o];return new Promise((o,n)=>{if(this.render&&e){d[t](["beforeUpdate"],this);const n=((e,r,o,n)=>s=>{e(r(s,o,{eventContext:n})),d[t](["afterUpdate"],n)})(o,r,e,this),s=this.render();s instanceof Promise?s.then(n):n(s)}else n(new Error("Please provide renderer (lit-html by default)"))})}}export default d;export{s as __state__,i as __store__,c as attachStore,u as createState};
//# sourceMappingURL=component.esm.js.map
