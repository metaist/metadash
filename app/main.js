/** metadash - a mini dashboard */
/*jslint indent: 2, maxlen: 120, browser: true, todo: true*/
/*global requirejs, require, define, console*/
requirejs.config({
  baseUrl: 'lib',
  enforceDefine: true,
  paths: {
    app: '../app',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.0/js/bootstrap.min',
    jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min',
    text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min',
    transparency: 'transparency.min'
  },
  shim: {
    bootstrap: ['jquery'],
    transparency: ['jquery']
  }
});

define(function (require) {
  'use strict';
  require('app/metadash');
});
