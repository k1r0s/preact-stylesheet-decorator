(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('kaop-ts'), require('scope-css')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'kaop-ts', 'scope-css'], factory) :
	(factory((global.reactStylesheet = {}),global.React,global.kaopTs,global.scope));
}(this, (function (exports,React,kaopTs,scope) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
scope = scope && scope.hasOwnProperty('default') ? scope['default'] : scope;

var getTag = function getTag(target) {
  if (target.__stylesheetTagName) return target.__stylesheetTagName;
  var uid = Math.random().toString(32).split(".").pop();
  return target.__stylesheetTagName = "element-" + uid;
};

var getProps = function getProps(props) {
  return Object.assign({}, props, { key: "component" });
};

var getStylesheet = function getStylesheet(target, stylesheet) {
  if (target.__stylesheetVNode) return target.__stylesheetVNode;
  stylesheet = stylesheet.replace(/(\r\n|\n|\r)/gm, "");

  // prefix all selectors to make stylesheet 'scoped' using scope-css package
  stylesheet = scope(stylesheet, target.__stylesheetTagName);

  // save a reference of the stylesheet within the class instance
  return target.__stylesheetVNode = React.createElement("style", { scoped: true, key: "scoped" }, stylesheet);
};

var renderStylesheet = function renderStylesheet(styleContent) {
  return kaopTs.afterMethod(function (meta) {
    if (meta.exception) throw meta.exception;
    var tag = getTag(meta.target.constructor);
    var stylesheetNode = getStylesheet(meta.target.constructor, styleContent);

    var fakeNode = React.createElement(meta.result.type, getProps(meta.result.props), meta.result.props.children);
    // wrap rendered vnode with a hoc
    meta.result = React.createElement(tag, null, [fakeNode, stylesheetNode]);
  });
};

var functionalStylesheet = function functionalStylesheet(styleContent) {
  return function (func) {
    var tag = getTag(func);
    var stylesheetNode = getStylesheet(func, styleContent);

    // wrap rendered vnode with a hoc
    return function (props) {
      var newProps = getProps(props);
      return React.createElement(tag, null, [React.createElement(func, newProps, newProps.children), stylesheetNode]);
    };
  };
};

var stylesheet = function stylesheet(styles, functional) {
  return functional ? functionalStylesheet(styles)(functional) : renderStylesheet(styles);
};

exports.stylesheet = stylesheet;

Object.defineProperty(exports, '__esModule', { value: true });

})));
