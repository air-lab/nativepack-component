# Nativepack Compopent

Simple native webcomponent class

## How to use

Create and setup your native webcomponent.

```js
import { render } from "lit-html"

import WebComponent from "nativepack-component"
import store from "./store"

class Component extends WebComponent {
  // Attach global store for all components (if you want to use flux-type store)
  static get store() {
    return store
  }
}

Component.render = render

export default Component
```

```js
import { html } from "lit-html";
import Component from "./mycomponent";

class HelloWorld extends Component {
  static get state() {
    return {
      counter: {
        type: Number,
        value: 1
      },
      world: {
        type: String,
        value: 'World'
      },
      user: {
        type: Object,
        value: {
          name: "Foo"
        }
      }
    }
  }

  render() {
    const { world, counter } = this.state

    return html`
      <div>
        Hello ${world} ${counter}
        <button @click="${this.increaseCounter}">Increase</button>
      </div>`
  }

  increaseCounter() {
    this.state.counter = this.state.counter + 1
  }
}

HelloWorld.define('hello-world', HelloWorld);
```
