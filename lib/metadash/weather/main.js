/*jslint indent: 2, maxlen: 80, browser: true, todo: true*/
/*global requirejs, require, define, console*/
define(function (require) {
  'use strict';
  console.log('Loaded: metadash/weather');
  var
    URL_YQL = 'http://query.yahooapis.com/v1/public/yql?callback=?',
    YQL_FEED = 'SELECT * FROM weather.forecast WHERE u="{units}" ' +
      'AND location IN (SELECT id FROM xml WHERE ' +
      'url="http://xoap.weather.com/search/search?where={city}" ' +
      'AND itemPath="search.loc")',
    $ = require('jquery'),
    metadash = require('app/metadash'),
    tmpl = require('text!metadash/weather.html'),
    weather = {};

  require('transparency');

  $.extend(metadash.gadgets, {'weather': weather});
  $.getCSS(require.toUrl('metadash/weather.css'));

  /** Initialize a weather gadget. */
  weather.init = function () {
    this.$gadget
      .addClass('weather')
      .html(tmpl);

    weather.update.apply(this);
  };

  weather.update = function () {
    this.$gadget.data('metadash', this.config);
    weather.refresh.apply(this);
  };

  weather.refresh = function () {
    console.log('refreshing weather for ' + this.config.city, this.$gadget);
    var
      config = this.config,
      $gadget = this.$gadget;

    $.getJSON(URL_YQL, {
      format: 'json',
      q: YQL_FEED
          .replace('{city}', config.city)
          .replace('{units}', {'imperial': 'f', 'metric': 'c'}[config.units])
    }, function (data) {
      var rules = {};
      data = data.query.results.channel;

      console.log(data);
      $gadget
        .find('.current')
          .find('.city a')
            .attr('href', data.link)
            .text(data.location.city)
          .end()
          .find('.icon')
            .addClass('wc-code-' + data.item.condition.code)
            .attr('title', data.item.condition.text)
          .end()
          .find('.units').val(config.units).end()
          .find('.temp').text(parseInt(data.item.condition.temp, 10)).end()
          .find('.text').text(data.item.condition.text).end()
          .find('.wind').text(data.wind.speed + ' ' + data.units.speed).end()
          .find('.humidity').text(data.atmosphere.humidity + '%').end()
        .end()
        .show();

      rules = {
        'icon': {
          'title': function (params) {
            $(params.element).addClass('wc-code-' + this.code);
            return this.text;
          }
        }
      };
      $gadget.find('.forecast').render(data.item.forecast.slice(0, 4), rules);
    });
  };

  // weather gadget defined

  metadash.$dash.on('change', '.weather .units', function () {
    var
      $this = $(this),
      context = { $gadget: $this.closest('.weather') },
      config = context.$gadget.data('metadash');

    context.config = $.extend(config, {units: $this.val()});
    weather.update.apply(context)
  });

  // weather gadget events attached

  return weather;
});//end weather
