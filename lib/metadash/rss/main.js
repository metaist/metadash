/*jslint indent: 2, maxlen: 80, browser: true, todo: true*/
/*global requirejs, require, define, console*/
define(function (require) {
  'use strict';
  console.log('Loaded: metadash/rss');
  var
    MAX_SUMMARY = 2000,
    URL_YQL = 'http://query.yahooapis.com/v1/public/yql?callback=?',
    YQL_FEED = 'SELECT entry FROM feednormalizer WHERE url IN ("{feeds}") ' +
    'AND output="atom_1.0" ' +
    '| unique(field="entry.id") ' +
    '| sort(field="entry.published") ' +
    '| tail(count={count})',
    $ = require('jquery'),
    metadash = require('app/metadash'),
    tmpl = require('text!metadash/rss.html'),
    rss = {};

  require('transparency');

  $.extend(metadash.gadgets, {'rss': rss});
  $.getCSS(require.toUrl('metadash/rss.css'));

  /** Initialize an RSS gadget. */
  rss.init = function () {
    this.$gadget
      .data('metadash', this.config)
      .addClass('rss')
      .html(tmpl);

    rss.refresh.apply(this);
  };

  rss.summarize = function (content) {
    var $dom, result = content;
    if (content.length > MAX_SUMMARY) {
      $dom = $(content).filter('.entry-summary:eq(0)'); // hAtom microformat
      if ($dom.length) {
        result = $dom.eq(0).text();
      } else {
        $dom = $dom.end().find('p:not(:empty):eq(0)');
        if ($dom.length) { result = $dom.text(); } // First paragraph
      }//end if: have some kind of result

      result = result.substr(0, MAX_SUMMARY) + ' [...]';
    }//end if: all done

    return result;
  };

  rss.refresh = function () {
    var $gadget = this.$gadget;
    $.getJSON(URL_YQL, {
      format: 'json',
      q: YQL_FEED
          .replace('{count}', this.config.count)
          .replace('{feeds}', this.config.feeds.join('", "'))
    }, function (data) {
      data = $.map(data.query.results.feed, function (item) {
        item = item.entry;
        return {
          author: item.author.name,
          title: item.title,
          date: item.date,
          url: ($.isArray(item.link) && item.link[0].href) || item.link.href,
          content:
            (item.summary && item.summary.content) || item.content.content
        };
      });

      console.log(data);
      var rules = {
        title: {
          href: function () { return this.url; }
        },
        content: {
          html: function () { return rss.summarize(this.content); }
        }
      };

      $gadget
        .find('.feed').render(data, rules).end()
        .show();
    });
  };

  return rss;
});//end rss
