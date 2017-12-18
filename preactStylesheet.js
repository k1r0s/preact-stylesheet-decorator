(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact'), require('kaop-ts'), require('decamelize'), require('scope-css')) :
	typeof define === 'function' && define.amd ? define(['exports', 'preact', 'kaop-ts', 'decamelize', 'scope-css'], factory) :
	(factory((global.preactStylesheet = {}),global.preact,global.kaopTs,global.decamelize,global.scope));
}(this, (function (exports,preact,kaopTs,decamelize,scope) { 'use strict';

decamelize = decamelize && decamelize.hasOwnProperty('default') ? decamelize['default'] : decamelize;
scope = scope && scope.hasOwnProperty('default') ? scope['default'] : scope;

var stylesheet = function stylesheet(styleContent) {
  return kaopTs.afterMethod(function (meta) {

    // create vnode stylesheet only once
    if (!meta.target.__stylesheetVNode) {
      var uid = Math.random().toString(32).split(".").pop();
      var className = meta.target.constructor.name;
      meta.target.__stylesheetTagName = "element-" + decamelize(className, "-") + "-" + uid;

      // remove all spaces, eols
      styleContent = styleContent.replace(/(\r\n|\n|\r)/gm, "");

      // prefix all selectors to make stylesheet 'scoped' using scope-css package
      styleContent = scope(styleContent, meta.target.__stylesheetTagName);

      // save a reference of the stylesheet within the class instance
      meta.target.__stylesheetVNode = preact.h("style", { scoped: true }, styleContent);
    }

    // wrap rendered vnode with another
    meta.result = preact.h(meta.target.__stylesheetTagName, null, [meta.result, meta.target.__stylesheetVNode]);
  });
};

exports.stylesheet = stylesheet;

Object.defineProperty(exports, '__esModule', { value: true });

})));
