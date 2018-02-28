This decorator allows to easily style Preact components through adding a scoped stylesheet inside that component and defined styles only get applied to it and its descendants.

Basically it allows to style in preact like Angular or [Vue does by adding a scoped stylesheet](https://vue-loader.vuejs.org/en/features/scoped-css.html)

### Demo

[![Edit z3p207zxml](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/z3p207zxml)

### Getting started

install `npm install stylesheet-decorator --save`

usage:

1. import
```javascript
import { stylesheet } from "stylesheet-decorator"
```

2. define a string with raw CSS content
```javascript
const style = `
  span { font-size: 20px; color: lightblue; }
`
```
3. Plug it on render fn of some Preact component

```javascript

@stylesheet(style)
render() {
  return <span>something</span>
}

or

stylesheet(style, props => <span>something</span>)
```
That's all.

This decorator supports all CSS capabilities defined here: https://www.npmjs.com/package/scope-css

This development is related on this conversation: [Twitter Link](https://twitter.com/k1r0s/status/919271946109554694) and this issue [GH preact issue](https://github.com/developit/preact/issues/909#issuecomment-336656084)
