/*
 * grunt-multi-pages-assets-generator
 * https://github.com/TRIPTYK/grunt-multi-pages-assets-generator
 *
 * Copyright (c) 2015 TRIPTYK Team
 * Licensed under the MIT license.
 */

'use strict';
var compressor = require('node-minify');

module.exports = function(grunt) {

  function generate(options, destinationFolder, srcFolder) {

    //Before startup check for the requirements
    if (!grunt.file.exists(options.configJSON)) grunt.fail.warn("There should be a config.json file at this path " + options.configJSON, 1);
    if (!grunt.file.exists(options.cssFolder)) grunt.fail.warn("There should be a css folder at this path " + options.cssFolder, 2);
    if (!grunt.file.exists(options.jsFolder)) grunt.fail.warn("There should be a js folder at this path " + options.jsFolder, 3);
    var pages = grunt.file.readJSON(options.configJSON).pages;
    pages.map(function(item) {
      var cssArr = item.css.map(function(inItem) {
        return options.cssFolder + '/' + inItem
      });
      var jsArr = item.jsComponents.map(function(inItem) {
        return options.jsComponents + '/' + inItem
      }).concat(item.js.map(function(inItem) {
        return options.jsFolder + '/' + inItem
      }));
      var fileName = item.idName;
      grunt.file.mkdir(destinationFolder);
      grunt.file.mkdir(destinationFolder + '/css');
      grunt.file.mkdir(destinationFolder + '/js');
      new compressor.minify({
        type: 'uglifyjs',
        fileIn: jsArr,
        fileOut: destinationFolder + '/js/' + fileName + '.min.js',
        callback: function(err, min) {
          console.log(err);
          //        console.log(min);
        }
      });
      new compressor.minify({
        type: 'clean-css',
        fileIn: cssArr,
        fileOut: destinationFolder + '/css/' + fileName + '.min.css',
        callback: function(err, min) {
          console.log('Clean-css');
          console.log(err);
          //        console.log(min);
        }
      });
      var destpage = item.page.replace(srcFolder, '');
      grunt.file.copy(item.page, destinationFolder + '/' + destpage)

    });
  }





  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('multi_pages_assets_generator', 'A grunt plugin to assemble css & js for multiple pages', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      jsFolder: this.jsFolder,
      jsComponents: this.jsComponents,
      cssFolder: this.cssFolder,
      configJSON: this.configJSON,
      cssCompression = this.cssCompression
    });
    // Iterate over all specified file groups.
    // this.files.forEach(function(f) {
    //   grunt.log.writeln('File de merde "' + f.dest + '" created.');
    // });
    generate(options, this.files[0].dest, this.filesSrc);

  });

};
