const { h, render, Component } = require("preact")
const { stylesheet } = require("..")
const decorate = (target, css) => {
  Object.defineProperty(target.prototype, "render", stylesheet(css)(target, "render", Object.getOwnPropertyDescriptor(target.prototype, "render")))
}
const scrap = document.createElement("section")

class TestComponent extends Component {

  render() {
    return h(
      "div",
      null,
      h(
        "span",
        null,
        "some test"
      )
    )
  }
}

decorate(TestComponent, `
  span { color: red }
`)

describe("test several rules regarding stylesheet rendering", () => {

  afterEach(() => scrap.innerHTML = "")

  it("should render stylesheet component before main content", () => {
    render(h(TestComponent, null, "stuff"), scrap)
    console.log(scrap.innerHTML)
    expect(scrap.innerHTML).toContain("span { color: red }")
    expect(scrap.innerHTML).toContain("style scoped")
  })
  // it("should render two components containing two style elements", () => {
  //   render(h("div", null, [
  //     h(TestComponent, null),
  //     h(TestComponent, null)
  //   ]), scrap)
  //   console.log(scrap.innerHTML)
  // })
})
