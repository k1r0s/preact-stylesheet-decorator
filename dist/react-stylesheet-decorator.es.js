import React from 'react';
import { afterMethod } from 'kaop-ts';
import decamelize from 'decamelize';
import scope from 'scope-css';

var getTag = function getTag(target) {
  if (target.__stylesheetTagName) return target.__stylesheetTagName;
  var uid = Math.random().toString(32).split(".").pop();
  return target.__stylesheetTagName = "element-" + decamelize(target.name, "-") + "-" + uid;
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
  return afterMethod(function (meta) {
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

export { stylesheet };
