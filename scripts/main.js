var emacsThemesGallery = emacsThemesGallery || {};
(function ($, undefined) {
    'use strict';

    var themeProperties = emacsThemesGallery.themeProperties;

    (function initialize() {
	initializeThemeProperties();
	initializeGallery();
    })();

    function initializeThemeProperties() {
	themeProperties.rootFolder		= 'screenshots/';
	themeProperties.darkFolder		= themeProperties.rootFolder + 'dark/';
	themeProperties.lightFolder		= themeProperties.rootFolder + 'light/';
	themeProperties.imgExtension	        =  '.png';

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
	    { name: 'Org',
	      extension: 'org'
	    },
	    { name: 'Dired',
	      extension: 'dired'
	    }
	];
    }

    function initializeGallery() {

	var documentReadyDeferred = $.Deferred();

	$(document).ready(function() {
	    documentReadyDeferred.resolve();
	});

	var melpaStatsDeferred = $.getJSON("http://query.yahooapis.com/v1/public/yql",
					   {
					       q     : "select * from json where url=\"http://melpa.milkbox.net/download_counts.json?fmt=JSON\"",
					       format: "json"
					   });

	melpaStatsDeferred.done(function(jsonQuery) {
	    var themeHits = jsonQuery.query.results.json;
	    $.each(themeProperties.themes, function(i, theme) {
		if (theme.melpaName === '') {
		    theme.melpaHits = 1;
		}
		else {
		    theme.melpaHits = parseInt(themeHits[theme.melpaName], 10);
		    theme.melpHitsLocaleString = theme.melpaHits.toLocaleString();
		}
	    });
	});
	melpaStatsDeferred.fail(function() {
	    $.each(themeProperties.themes, function(i, theme) {
		theme.melpaHits = 1;
		theme.melpHitsLocaleString = '~';
	    });
	});

	$.when(documentReadyDeferred, melpaStatsDeferred).always(function() {
	    $('#loading').hide();
	    var filterView = new FilterView();
	    var galleryView = new GalleryView(filterView.getSelectedFilter());
	});
    }

    var FilterView = function() {
	var $themeColor;
	var $languagesAndModes;
	var $sortBy;
	var shade;
	var language;
	var sortBy;

	initialize();

	function initialize() {
	    $themeColor = $('#themeColor ');
	    $languagesAndModes = $('#languagesAndModes');
	    $sortBy = $('#sortBy');
	    shade = $themeColor.find('input[type="radio"]:checked').val() === 'Dark' ? 'dark' : 'light';
	    language = $languagesAndModes.find(':checked').val();
	    sortBy = $sortBy.find(':checked').val();

	    $themeColor.buttonset();
	    $languagesAndModes.selectmenu({
		width:120,
		select: onLanguageChange
	    });
	    $sortBy.selectmenu({
		width:100,
		select: onSortByChange
	    });

	    $themeColor.find('input[type="radio"]').off().on('change', onShadeChange);;
	}

	this.getSelectedFilter = function() {
	    return { shade: shade, language: language, sortBy: sortBy };
	};

	function onShadeChange() {
	    shade = ($(this).val() === 'Dark') ? 'dark' : 'light';
	    $(document).trigger('onShadeChange', [language, shade, sortBy]);
	}

	function onLanguageChange(event, ui) {
	    language = ui.item.value;
	    $(document).trigger('onLanguageChange', [language, shade, sortBy]);
	}

	function onSortByChange(event, ui) {
	    sortBy = ui.item.value;
	    $(document).trigger('onSortByChange', [language, shade, sortBy]);
	}
    };

    var GalleryView = function(initialFilter) {
	var $gallery;
	var $themeCollection;

	initialize();

	function initialize() {
	    $gallery = $('#gallery');
	    loadAllThemes();
	    bindEvents();
	}

	function loadAllThemes() {
	    $.each(themeProperties.themes, function(i, theme) {
		$.each(themeProperties.languages, function(j, language) {
		    var shade = theme.dark ? 'dark' : 'light';
		    var themeView = new ThemeView(theme, language, shade);
		    if (((initialFilter.shade === 'dark') != theme.dark) || (initialFilter.language != language.name)) {
			themeView.getMarkup().hide();
		    }
		    $gallery.append(themeView.getMarkup());
		});
	    });
	    $themeCollection = $gallery.find('li');
	    sortThemes(initialFilter.sortBy);
	}

	function sortThemes(sortBy) {
	    $themeCollection.sort(function(a, b) {
		if (sortBy === 'A-Z' || sortBy === 'Z-A') {
		    var aName = $(a).data('name');
		    var bName = $(b).data('name');
		    var order = (sortBy === 'A-Z') ? -1 : 1;

		    if (aName < bName) {
			return 1 * order;
		    }
		    else if (aName > bName) {
			return -1 * order;
		    }
		    else {
			return 0;
		    }
		}
		else {
		    var aMelpaHits = $(a).data('melpaHits');
		    var bMelpaHits = $(b).data('melpaHits');

		    if (aMelpaHits > bMelpaHits) {
			return -1;
		    }
		    else if (aMelpaHits < bMelpaHits) {
			return 1;
		    }
		    else {
			return 0;
		    }
		}
	    });
	    $themeCollection.detach().appendTo($gallery);
	}

	function refreshThemes(language, shade, sortBy) {
	    $themeCollection.hide();
	    $themeCollection.filter('.' + shade + '.' + language).show();
	}

	function bindEvents() {
	    $(document).off('onShadeChange onLanguageChange').on('onShadeChange onLanguageChange', function(event, language, shade, sortBy) {
		refreshThemes(language, shade, sortBy);
	    });
	    $(document).off('onSortByChange').on('onSortByChange', function(event, language, shade, sortBy) {
		sortThemes(sortBy);
	    });
	}
    };

    var ThemeView = function(theme, language, shade) {
	var themeLocation;
	var themeElement;
	initialize();

	function initialize() {
	    themeLocation = getThemeLocation();
	    themeElement = createThemeElement();
	}

	this.getMarkup = function() {
	    return themeElement;
	};

	function getThemeLocation() {
	    var themeLocation = (theme.dark ? themeProperties.darkFolder :
				 themeProperties.lightFolder ) + theme.name + '/' +
	    	    language.extension + themeProperties.imgExtension;

	    return themeLocation;
	}

	function createThemeElement() {
	    var $img = $('<img>', {src: themeLocation, width: 316, height: 221});
	    var $themeContainer = $('<li>', {class: shade + ' ' + language.name})
		    .data('name', theme.name)
		    .data('melpaHits', theme.melpaHits);


	    $themeContainer.append(getThemeNameMarkup());
	    $themeContainer.append($img);
	    $themeContainer.append(getThemeLinkMarkup());

	    return $themeContainer;
	}

	function getThemeNameMarkup() {
	    var $div = $('<div class="themeName">' + theme.name + ' </div>');
	    return $div;
	}

	function getThemeLinkMarkup() {
	    var $div;
	    var $span;
	    $div = $('<div class="themeHomeLink">');
	    if (theme.location != 'native') {
		var $a = $('<a>', {href: theme.location, text:'GitHub'});
		$div.append($a);
		$span = $('<span class="downloads"> Downloads: ' + theme.melpHitsLocaleString + '</span>');
		$div.append($span);
	    }
	    return $div;
	}
    };
})(jQuery);
