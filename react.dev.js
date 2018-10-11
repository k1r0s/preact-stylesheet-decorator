import React from "react"
import { afterMethod } from "kaop-ts";
import scope from "scope-css";

const getTag = target => {
  if(target.__stylesheetTagName) return target.__stylesheetTagName;
  const uid = Math.random().toString(32).split(".").pop();
  return target.__stylesheetTagName = `element-${uid}`;
}

const getProps = props => Object.assign({}, props, { key: "component" });

const getStylesheet = (target, stylesheet) => {
  if(target.__stylesheetVNode) return target.__stylesheetVNode;
  stylesheet = stylesheet.replace(/(\r\n|\n|\r)/gm, "");

  // prefix all selectors to make stylesheet 'scoped' using scope-css package
  stylesheet = scope(stylesheet, target.__stylesheetTagName);

  // save a reference of the stylesheet within the class instance
  return target.__stylesheetVNode = React.createElement("style", { scoped: true, key: "scoped" }, stylesheet);
}

const renderStylesheet = styleContent => afterMethod((meta) => {
  const tag = getTag(meta.target.constructor);
  const stylesheetNode = getStylesheet(meta.target.constructor, styleContent);

  const fakeNode = React.createElement(meta.result.type, getProps(meta.result.props), meta.result.props.children);
  // wrap rendered vnode with a hoc
  meta.result = React.createElement(tag, null, [ fakeNode, stylesheetNode ]);
});

const functionalStylesheet = styleContent => func => {
  const tag = getTag(func);
  const stylesheetNode = getStylesheet(func, styleContent);

  // wrap rendered vnode with a hoc
  return props => {
    const newProps = getProps(props);
    return React.createElement(tag, null, [ React.createElement(func, newProps, newProps.children), stylesheetNode ]);
  };
};

export const stylesheet = (styles, functional) => functional ? functionalStylesheet(styles)(functional): renderStylesheet(styles);
