/** metadash - a mini dashboard */
/*jslint indent: 2, maxlen: 80, browser: true, todo: true*/
/*global requirejs, require, define, console*/
define(function (require) {
  'use strict';
  var
    URL_CONFIG = window.location.search.substr(1) || 'app/config.json',
    ERR = {
      NOT_ARRAY: 'Expecting configuration to be an array.',
      BAD_SIZE: 'Expecting between 1 and 4 columns. Got: '
    },
    $ = require('jquery'),
    $dash = $('#dash'),
    metadash = {
      $dash: $dash,
      config: {},
      gadgets: {}
    };

  $.getCSS = function (url) {
    $('<link />')
      .attr({rel: 'stylesheet', href: url})
      .appendTo($('head'));
  };

  // Load Settings
  $.getJSON(URL_CONFIG, function (data) {
    if (!$.isArray(data)) { $.error(ERR.NOT_ARRAY); }
    if (data.length < 1 || data.length > 4) {
      $.error(ERR.BAD_SIZE + data.length);
    }//end if: data is not poorly formatted

    var width = parseInt(12 / data.length, 10);

    $.each(data, function (i, col) {
      var $column = $('<div id="col-' + i + '" />')
                      .addClass('column col-md-' + width);
      $.each(col, function (j, config) {
        // Note that gadgets need to be CommonJS packages.
        requirejs.config({packages: [config.gadget]});
        require([config.gadget], function (init) {
          var
            $gadget = $('<div id="gadget-' + i + '-' + j + '"/>')
                        .addClass('gadget'),
            context = {$gadget: $gadget, config: config};
          if (init && $.isFunction(init.init)) { init = init.init;  }
          if (init && $.isFunction(init)) { init.apply(context); }

          $column.append($gadget); //added gadget
        });//end require gadget
      });//end $.each gadget

      $dash.append($column); // added column
    });//end $.each column
  });//end $.getJSON settings

  return metadash;
});//end metadash
