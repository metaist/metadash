(function($) { $(document).ready(function() {
var
	$input = $('#txt-url'),
	$button = $('#btn-add'),
	$list = $('#urls'),
	$none = $('#no-results'),

	options = {
		cookie: 'metadash',
		expires: 365,
	},

	// Return the array in the cookie.
	load = function() { return $.parseJSON($.cookie(options.cookie)); },

	// Return the string to store in the cookie.
	serialize = function() {
		var $items = $('.url', $list)	;
		if(!$items.length) { return null; }

		var urls = [];
		$items.each(function() {
			urls.push($(this).attr('href'));
		});

		return '["'+urls.join('","')+'"]';
	},

	// Save the cookie.
	save = function() {
		return $.cookie(
			options.cookie, serialize(),
			{expires: options.expires}
		);
	},

	// Populate the list.
	refresh = function() {
		var urls = load();
		if(!urls) {
			$none.show();
			return;
		}

		$list.empty();
		$.each(urls, function(i, url) { add(url); });
	},

	// Add a URL to the list.
	add = function(url) {
		$none.hide();
		return $list.append('<li><span class="btn-clear ui-icon ui-icon-closethick">&nbsp;</span> '
			+ '<a class="url" rel="no-follow" href="'
			+ url + '">'+url+'</a></li>');
	};

	// Event Bindings

	$list.on('click', '.btn-clear', function() {
		$(this).parent().remove();
		save();

		if(!$('li', $list).length) { $none.show(); }
	});

	$input.keyup(function(e){
		if(13 === e.which) { $button.click(); }
	});

	$button.click(function() {
		var url = $.trim($input.val());
		if(!url) {
			$input.val('').focus();
			return;
		}

		if(!url.match(/:\/\//)) { url = 'http://' + url; }

		url = new URI(url);
		add(url.normalize());
		save();
		$input
			.val('')
			.focus();
	});

	// Initialization
	$list.sortable({
		update: function(e, ui) { save(); }
	});
	refresh();
	save();
});
})(jQuery);
