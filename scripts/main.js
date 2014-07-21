(function ($, undefined) {
    "use strict";
    var themeProperties = emacsThemesGallery.themeProperties;
    
    themeProperties.rootFolder		= '../screenshots/';
    themeProperties.darkFolder		= themeProperties.rootFolder + 'dark/';
    themeProperties.lightFolder		= themeProperties.rootFolder + 'light/';
    themeProperties.imgExtension	=  '.png';
    
    themeProperties.languages = [
	{ name: 'C',
	  extension: 'c'
	},
	{ name: 'Java',
	  extension: 'java'
	},
	{ name: 'JavaScript',
	  extension: 'js'
	},
	{ name: 'HTML',
	  extension: 'html'
	},
	{ name: 'Elisp',
	  extension: 'el'
	},
	{ name: 'Dired',
	  extension: ''
	}
    ];

    var filter = {};

    function reloadTheme(filter) {
	var $galleryBody = $('#gallery tbody').html('<tr></tr>');
	var themeElements = [];
	$.each(themeProperties.themes, function(i, theme) {
	    var themeElement = {};
	    var themeLocation;

	    var language = $.grep(themeProperties.languages, function(language) {
	    	return (language.name === filter.language);
	    })[0];

	    if (filter.dark && theme.dark) {
	    	themeLocation = themeProperties.darkFolder + theme.name + '/' +
	    	    language.extension + themeProperties.imgExtension;
	    	themeElement.$img = $('<img>', {src: themeLocation});
		themeElement.name = theme.name;
		themeElement.location = theme.location;
		themeElements.push(themeElement);
	    }
	    else if (filter.light && !theme.dark) {
	    	themeLocation = themeProperties.lightFolder + theme.name + '/' +
	    	    language.extension + themeProperties.imgExtension;
	    	themeElement.$img = $('<img>', {src: themeLocation});
		themeElement.name = theme.name;
		themeElement.location = theme.location;
		themeElements.push(themeElement);
	    }

	});

	$.each(themeElements, function(i, themeElement) {
	    var $td = $('<td>');
	    $td.append(getThemeNameMarkup(themeElement));
	    $td.append(themeElement.$img);
	    $galleryBody.find('tr:last').append($td);
	    $td.append(getThemeLinkMarkup(themeElement));
	    if ((i + 1) % 3 === 0) {
		$galleryBody.append('<tr> </tr>');
	    }
	});
    }

    function getThemeNameMarkup(themeProps) {
	var $span = $('<span>' + themeProps.name + '</span>');
	return $span;
    }
    function getThemeLinkMarkup(themeProps) {
	if (themeProps.location != 'native') {
	    console.log(themeProps.location);
	    var $a = $('<a>', {href: themeProps.location, text:'GitHub'});
	}

	return $a;
    }
    
    function events() {
	$('#color').off().on('change', function() {
	    filter.dark = ($(this).val() === 'Dark');
	    filter.light = !filter.light;
	    reloadTheme(filter);
	});
	$('#languagesAndModes').off().on('change', function() {
	    filter.language = $(this).val();
	    reloadTheme(filter);
	});
    }

    function init() {
	filter.dark = ($('#color').val() === 'Dark');
	filter.light = !filter.dark;
	filter.language = $('#languagesAndModes').val();
	reloadTheme(filter);
	events();
    }

    $(document).ready(function() {
	init();
    });
})(jQuery);
