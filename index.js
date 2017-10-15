import { h } from "preact";
import { afterMethod } from "kaop-ts";
import decamelize from "decamelize";

export const stylesheet = (styleContent) =>
afterMethod((meta) => {

  // create vnode stylesheet only once
  if(!meta.scope.__stylesheetVNode){
    meta.scope.__stylesheetTagName = decamelize(meta.target.constructor.name, "-");

    // remove all spaces, eols
    styleContent = styleContent.replace(/(\r\n\s|\n|\r|\s)/gm, "");

    // prefix all selectors to make stylesheet 'scoped'
    styleContent = styleContent.replace(
      /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
      `${meta.scope.__stylesheetTagName} $1$2`
    )
    
    meta.scope.__stylesheetVNode = h("style", { scoped: true }, styleContent);
  }

  // wrap rendered vnode with another
  meta.result = h(
    meta.scope.__stylesheetTagName, null,
    [ meta.result, meta.scope.__stylesheetVNode ]
  );

});
