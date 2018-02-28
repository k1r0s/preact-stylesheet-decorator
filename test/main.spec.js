const { h, render, Component } = require("preact")
const { stylesheet } = require("..")
const decorate = (target, css) => {
  Object.defineProperty(target.prototype, "render", stylesheet(css)(target, "render", Object.getOwnPropertyDescriptor(target.prototype, "render")))
}
const scrap = document.createElement("section")

const style = `
  span { color: red }
`

const hscript = () => h(
  "div",
  null,
  h(
    "span",
    null,
    "some test"
  )
)

class TestComponent extends Component {
 render() { return hscript() }
}

decorate(TestComponent, style)

const FunctionalComp = stylesheet(style, props => hscript())

describe("test several rules regarding stylesheet rendering", () => {

  afterEach(() => scrap.innerHTML = "")

  it("should render stylesheet component before main content", () => {
    render(h(TestComponent, null, "stuff"), scrap)
    expect(scrap.innerHTML).toContain("span { color: red }")
    expect(scrap.innerHTML).toContain("style scoped")
  })
  it("should render a functional component", () => {
    render(h(FunctionalComp, null, "stuff"), scrap)
    expect(scrap.innerHTML).toContain("span { color: red }")
    expect(scrap.innerHTML).toContain("style scoped")
  })
})
