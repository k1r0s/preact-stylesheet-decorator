(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('preact'), require('kaop-ts'), require('scope-css')) :
	typeof define === 'function' && define.amd ? define(['exports', 'preact', 'kaop-ts', 'scope-css'], factory) :
	(factory((global.preactStylesheet = {}),global.preact,global.kaopTs,global.scope));
}(this, (function (exports,preact,kaopTs,scope) { 'use strict';

scope = scope && scope.hasOwnProperty('default') ? scope['default'] : scope;

var getTag = function getTag(target) {
  if (target.__stylesheetTagName) return target.__stylesheetTagName;
  var uid = Math.random().toString(32).split(".").pop();
  return target.__stylesheetTagName = "element-" + uid;
};

var getStylesheet = function getStylesheet(target, stylesheet) {
  if (target.__stylesheetVNode) return target.__stylesheetVNode;
  stylesheet = stylesheet.replace(/(\r\n|\n|\r)/gm, "");

  // prefix all selectors to make stylesheet 'scoped' using scope-css package
  stylesheet = scope(stylesheet, target.__stylesheetTagName);

  // save a reference of the stylesheet within the class instance
  return target.__stylesheetVNode = preact.h("style", { scoped: true }, stylesheet);
};

var renderStylesheet = function renderStylesheet(styleContent) {
  return kaopTs.afterMethod(function (meta) {
    if (meta.exception) throw meta.exception;
    var tag = getTag(meta.target.constructor);
    var stylesheetNode = getStylesheet(meta.target.constructor, styleContent);

    // wrap rendered vnode with a hoc
    meta.result = preact.h(tag, null, [meta.result, stylesheetNode]);
  });
};

var functionalStylesheet = function functionalStylesheet(styleContent) {
  return function (func) {
    var tag = getTag(func);
    var stylesheetNode = getStylesheet(func, styleContent);

    // wrap rendered vnode with a hoc
    return function (props) {
      return preact.h(tag, null, [func(props), stylesheetNode]);
    };
  };
};

var stylesheet = function stylesheet(styles, functional) {
  return functional ? functionalStylesheet(styles)(functional) : renderStylesheet(styles);
};

exports.stylesheet = stylesheet;

Object.defineProperty(exports, '__esModule', { value: true });

})));
