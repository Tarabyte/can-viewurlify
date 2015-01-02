'use strict';
var through = require('through2');
var esprima = require('esprima');
var traverse = require('estraverse');
var codegen = require('escodegen');
var merge = require('merge');
var path = require('path');

/**
 * Default settings.
 */
var defaults = {
  extensions: ['ejs', 'mustache', 'stache'],
  prefix: ''
};

function isLiteral(node) {
  return node.type === 'Literal';
}

function wrapWithLiteral(str) {
  return {
    type: 'Literal',
    value: str
  };
}

/**
 * Replace all template path like URLs to be cwd based.
 * For example:
 * in //src/module/some_controller.js
 * './template.ejs' --> 'src/module/template.ejs'
 * @param {String} file File path.
 * @param {Object} [options] Options hash.
 * @return {Stream} Transforming stream.
 */
function fixUrls(file, options) {
  var contents = '', 
      stream = through(collect, transform),
      extensions = [],
      cwd = process.cwd(),
      directory = path.dirname(file),
      shouldTransform = false,
      prefix;
  options = merge(true, defaults, options || {});
  
  
  extensions = options.extensions;
  prefix = options.prefix;
  
  function isTemplatePath(str) {
    var ext = path.extname(str).substr(1);
    return extensions.indexOf(ext) >= 0;
  }
  
  function fixPath(url) {  
    return path.join(prefix, path
      .relative(cwd, path.join(directory, url)))
      .split(path.sep) //we need nix pathes \\ --> /
      .join('/');
    
  }
  
  function collect(buf, enc, next) {
    contents += buf;
    next();    
  }
  
  function transform(next) {
    var result = contents,
        ast = esprima.parse(result);
    
    traverse.replace(ast, {
      enter: function(node) {
        if(isLiteral(node) && isTemplatePath(node.value)) {
          shouldTransform = true;
          return wrapWithLiteral(fixPath(node.value));
        }
      }
    });
    
    if(shouldTransform) {
      result = codegen.generate(ast);
    }
    
    stream.push(result);
    next();
  }
  
  return stream;
  
}

module.exports = fixUrls;
