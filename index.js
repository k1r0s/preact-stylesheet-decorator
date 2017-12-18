import { h } from "preact";
import { afterMethod } from "kaop-ts";
import decamelize from "decamelize";
import scope from "scope-css";

export const stylesheet = (styleContent) =>
afterMethod((meta) => {

  // create vnode stylesheet only once
  if(!meta.target.__stylesheetVNode){
    const uid = Math.random().toString(32).split(".").pop();
    const className = meta.target.constructor.name;
    meta.target.__stylesheetTagName = `element-${decamelize(className, "-")}-${uid}`;

    // remove all spaces, eols
    styleContent = styleContent.replace(/(\r\n|\n|\r)/gm, "");

    // prefix all selectors to make stylesheet 'scoped' using scope-css package
    styleContent = scope(styleContent, meta.target.__stylesheetTagName);

    // save a reference of the stylesheet within the class instance
    meta.target.__stylesheetVNode = h("style", { scoped: true }, styleContent);
  }

  // wrap rendered vnode with another
  meta.result = h(
    meta.target.__stylesheetTagName, null,
    [ meta.result, meta.target.__stylesheetVNode ]
  );

});
