'use strict';
var urlfixer = require('../');
var path = require('path');
var fs = require('fs');
var Test = require('./_test.js');
require('chai').should();

describe('urlfixer', function() {
  it('should be a function', function() {
    urlfixer.should.be.a('function');
  });
  
  var options = {
    '_prefix.js': {
      prefix: 'base'
    }
  };
  
  fs.readdir(path.join(__dirname, 'data'), function(err, files) {
    if(err) {
      return console.log('Unable to read directory: ./test/data');
    }      

    files.filter(function(name) {
      return name.indexOf('.expect.') < 0;
    })
    .map(function(name) {
      return new Test(path.join(__dirname, 'data', name), options[name]);  
    })
    .forEach(function(test){
      describe(test.description(), test.run.bind(test));
    });
  });
});

