import { h } from "preact";
import { afterMethod } from "kaop-ts";
import scope from "scope-css";


const getTag = target => {
  if(target.__stylesheetTagName) return target.__stylesheetTagName;
  const uid = Math.random().toString(32).split(".").pop();
  return target.__stylesheetTagName = `element-${uid}`;
}

const getStylesheet = (target, stylesheet) => {
  if(target.__stylesheetVNode) return target.__stylesheetVNode;
  stylesheet = stylesheet.replace(/(\r\n|\n|\r)/gm, "");

  // prefix all selectors to make stylesheet 'scoped' using scope-css package
  stylesheet = scope(stylesheet, target.__stylesheetTagName);

  // save a reference of the stylesheet within the class instance
  return target.__stylesheetVNode = h("style", { scoped: true }, stylesheet);
}

const renderStylesheet = styleContent => afterMethod((meta) => {
  if(meta.exception) throw meta.exception;
  const tag = getTag(meta.target.constructor);
  const stylesheetNode = getStylesheet(meta.target.constructor, styleContent);

  // wrap rendered vnode with a hoc
  meta.result = h(tag, null, [ meta.result, stylesheetNode ]);
});

const functionalStylesheet = styleContent => func => {
  const tag = getTag(func);
  const stylesheetNode = getStylesheet(func, styleContent);

  // wrap rendered vnode with a hoc
  return props => h(tag, null, [ func(props), stylesheetNode ]);
};

export const stylesheet = (styles, functional) => functional ? functionalStylesheet(styles)(functional) : renderStylesheet(styles);
