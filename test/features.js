'use strict';

var fs          = require('fs');
var options     = require('../lib/options')().defaults;
var pleeease    = require('../lib/');
var assert      = require('assert');
var test        = require('../test/_helpers.js').test;
var __features  = require('../test/_helpers.js').dirname['features'];

/**
 *
 * Describe Features
 *
 */
describe('Features', function () {

  beforeEach(function() {
    options.minifier = false;
  });

  describe('Prefixes', function () {

    it('should generate -webkit- prefixes for calc() (support iOS6)', function () {

      // options
      options.autoprefixer = ['iOS 6'];
      test('prefixes', options);

    });

  });

  describe('Variables', function () {

    it('should evaluate variables', function () {

      // options
      options.autoprefixer = false;
      test('variables', options);

    });

  });

  describe('Pseudo-elements', function () {

    it('should replace pseudo-elements syntax', function () {

      test('pseudoElements', options);

    });

  });

  describe('Filters', function () {

    it('should convert CSS filters to SVG', function () {

      // options
      options.autoprefixer = false;
      test('filters', options);

    });

    it('should not convert CSS filters to SVG when asked', function () {

      // options
      var opts = options;
      opts.autoprefixer = false;
      opts.filters = false;
      opts.same = true;

      test('filters', opts);

    });

    it('should add IE filters when asked', function () {

      // options
      var opts = options;
      opts.autoprefixer = false;
      opts.filters = { oldIE: true };
      opts.same = false;
      test('filters-ie', opts);

    });

  });

  describe('MQs', function () {

    it('should combine media-queries', function () {

      // options
      options.minifier = true;
      test('mq', options);

    });

  });

  describe('Imports', function () {

    it('should combine files with imports', function() {
      var compile = function (inputs, options) {
        // get inputs files
        var CSS = inputs.map(function(input) {
          return fs.readFileSync(input).toString();
        });
        // options
        options.autoprefixer = true;
        options.minifier = true;
        options.import = __features;
        // fixed CSS
        return pleeease.process(CSS.join('\n'), options);
      };

      options.in = [__features + 'import.css', __features + 'mq.css'];

      // process
      var processed = compile(options.in, options);
      var expected = fs.readFileSync(__features + 'import.out.css').toString();

      assert.equal(processed,expected);
    });

  });

  describe('Minifier', function () {

    it('should minify when asked', function() {
      //css
      var css = '.elem {\n' +
              'color: #f39;\n' +
          '}';
      var expected = '.elem{color:#f39}';
      // options
      options.minifier = true;
      // process
      var processed = pleeease.process(css, options);

      assert.equal(processed, expected);

    });

  });

});