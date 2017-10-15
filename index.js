import { h } from "preact";
import { afterMethod } from "kaop-ts";
import decamelize from "decamelize";
import scope from "scope-css";

export const stylesheet = (styleContent) =>
afterMethod((meta) => {

  // create vnode stylesheet only once
  if(!meta.scope.__stylesheetVNode){
    meta.scope.__stylesheetTagName = decamelize(meta.target.constructor.name, "-");

    // remove all spaces, eols
    styleContent = styleContent.replace(/(\r\n\s|\n|\r|\s)/gm, "");

    // prefix all selectors to make stylesheet 'scoped' using scope-css package
    styleContent = scope(styleContent, meta.scope.__stylesheetTagName);

    // save a reference of the stylesheet within the class instance
    meta.scope.__stylesheetVNode = h("style", { scoped: true }, styleContent);
  }

  // wrap rendered vnode with another
  meta.result = h(
    meta.scope.__stylesheetTagName, null,
    [ meta.result, meta.scope.__stylesheetVNode ]
  );

});
