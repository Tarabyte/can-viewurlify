can-viewurlify ![Build Status](https://travis-ci.org/Tarabyte/can-viewurlify.svg)
==============

> Resolves template urls for can.view bundled with browserify.

##What it does?
This module resolves urls for [CanJS](http://canjs.com/) view templates.
```javascript
//file src/components/grid/grid_control.js
var renderer = can.view('./grid.mustache');

//-t can-viewurlify
var renderer = can.view('src/components/grid/grid.mustache);

//-t can-viewurlify with custom prefix: 'base'
var renderer = can.view('base/src/components/grid/grid.mustache);
```
##How it works?
It parses a file to AST and replace all String Literal nodes ending with `.ejs`, `.mustache`, `.stache` with `cwd` relative path (unix separator).

##Available Options
**extensions** - Array of extensions.  
default value - `['ejs', 'mustache', 'stache]`

**prefix** - String to prefix resulting urls.  
default value - `''` empty string