const t=Symbol("__run__"),e=Symbol("__root__"),r=Symbol("__tag__"),o=Symbol("__render__"),s=/^(\w+)-(\w+)$/,n=Symbol("validate"),i=Symbol("__state__"),a=Symbol("__store__"),c={enumerable:!1,configurable:!1,writable:!1};function u(t){return"function"==typeof t}function d(t,e=a,r){return t.reflector=r||this.requestUpdate.bind(this),Object.defineProperty(this,e,{...c,value:t}),!0}function l(t,e=i,r){const o=this,s=new Proxy({...t},{get(t,e){const r=t[e];if("object"==typeof r&&Object.prototype.hasOwnProperty.call(r,"value"))return r.value},deleteProperty:(t,e)=>(delete t[e],o.requestUpdate(void 0,e),!0),set(t,e,s){const n=t[e];if("object"==typeof n&&(i=n.value,a=s,!Object.is(i,a)&&!(u(i)&&u(a)?i.toString()===a.toString():Object.is(JSON.stringify(i),JSON.stringify(a))))){if(n.type&&typeof s!=typeof n.type())throw new TypeError(`Wrong type of propery "${e}".`);return n.value=s,"function"==typeof r?r(s,e):o.requestUpdate&&o.requestUpdate(s,e),!0}var i,a;return!1}});Object.defineProperty(this,e,{...c,value:s})}function h(){const t=this;Object.defineProperty(t,"ref",{...c,value:new Proxy({},{get:(r,o)=>t[e].querySelector('[ref="'+o+'"]')})})}class p extends HTMLElement{static set tagName(t){if(!s.test(t))throw new Error("Wrong format of tag. Tag name should follow next format - `*-*` like app-drawer, etc... ");this[r]=t}static get tagName(){return this[r]}static get mode(){}static set render(t){"function"==typeof t&&(this[o]=t)}get state(){return this[i]||null}get store(){return this[a]||null}get root(){return this[e]}constructor(...r){super(r);const{state:i,mode:a,mixins:c,store:u,tagName:f}=this.constructor;if(!s.test(f))throw new Error("Static property tagName is required");if(this[n](i),"function"!=typeof this.constructor[o])throw new Error('Renderer is undefined. For example set "lit-html" render function');["open","closed"].includes(a)&&(this[e]=this.attachShadow({mode:a})),h.call(this),i&&"object"==typeof i&&l.call(this,i),u&&"object"==typeof u&&d.call(this,u),Array.isArray(c)&&c.forEach(t=>t.created&&t.created.apply(this,r)),p[t](["created"],this)}static mount(t=document.body,e=!0){if(!(t instanceof HTMLElement&&t.insertAdjacentHTML&&this.tagName))throw new Error("Static property tagName is required");e&&document.querySelector(this.tagName)||t.insertAdjacentHTML("beforeend",`<${this.tagName} />`)}static define(t){return this.tagName=t,window.customElements.get(t)?module&&module.hot&&module.hot.status&&"apply"===module.hot.status()&&Array.from(document.querySelectorAll(t)).forEach(t=>{Object.setPrototypeOf(t,this.prototype),t.requestUpdate&&t.requestUpdate()}):window.customElements.define(t,this),this}static[t](t,e,r){t.forEach(t=>e[t]&&"function"==typeof e[t]&&e[t].apply(e,r))}[n](t={}){if(!t)return;const e=Object.keys(t);for(const r of e){const e=t[r];if(e.type&&typeof e.value!=typeof e.type())throw new TypeError(`Wrong type of propery "${r}".`)}}adoptedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.moved&&t.moved.call(this)),p[t](["moved","requestUpdate"],this)}connectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.mounted&&t.mounted.call(this)),p[t](["mounted","requestUpdate"],this)}attributeChangedCallback(...t){u(this.updated)&&this.updated(...t)}disconnectedCallback(){const{mixins:e}=this.constructor;Array.isArray(e)&&e.forEach(t=>t.unmounted&&t.unmounted.call(this)),p[t](["unmounted"],this)}async requestUpdate(){const e=this.shadowRoot||this.root||this,r=this.constructor[o];await p[t](["beforeUpdate"],this);const s=await this.render();r?await r(s,e,{eventContext:this}):"string"==typeof s&&(e.innerHTML=s),p[t](["afterUpdate"],this)}}export default p;export{i as __state__,a as __store__,d as attachStore,l as createState};
//# sourceMappingURL=component.esm.js.map
