var emacsThemesGallery = emacsThemesGallery || {};
(function ($, undefined) {
    'use strict';

    var themeProperties = emacsThemesGallery.themeProperties;
    
    themeProperties.rootFolder		= 'screenshots/';
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
	{ name: 'Org',
	  extension: 'org'
	},
	{ name: 'Dired',
	  extension: ''
	}
    ];

    var FilterView = function() {
	
	var $themeColor;
	var $languagesAndModes;
	var shade;
	var language;
	
	initialize();

	function initialize() {
	    $themeColor = $('#themeColor ');
	    $languagesAndModes = $('#languagesAndModes');
	    shade = $themeColor.find('input[type="radio"]:checked').val();
	    language = $languagesAndModes.find(':checked').val();

	    $themeColor.buttonset();
	    $languagesAndModes.selectmenu({
		select: onLanguageChange
	    });

	    $themeColor.find('input[type="radio"]').off().on('change', onShadeChange);;
	}

	this.getSelectedFilter = function() {
	    return { shade: shade, language: language };
	};

	function onShadeChange() {
	    shade = ($(this).val() === 'Dark') ? 'dark' : 'light';   
	    $(document).trigger('filterChange', [language, shade]);
	}

	function onLanguageChange(event, ui) {
	    language = ui.item.value;
	    $(document).trigger('filterChange', [language, shade]);
	}
    };

    var GalleryView = function(initialFilter) {
	var $gallery;

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
		    if (((initialFilter.shade === 'Dark') != theme.dark) || (initialFilter.language != language.name)) {
			themeView.getMarkup().hide();
		    }
		    $gallery.append(themeView.getMarkup());
		});
	    });
	}

	function refreshThemes(language, shade) {
	    $gallery.find('li').hide();
	    $gallery.find('li.' + shade + '.' + language).show();
	}

	function bindEvents() {
	    $(document).off('filterChange').on('filterChange', function(event, language, shade) {
		refreshThemes(language, shade);
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
	    var $img = $('<img>', {src: themeLocation});
	    var $themeContainer = $('<li>', {class: shade + ' ' + language.name});

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
	    $div = $('<div class="themeHomeLink">');
	    if (theme.location != 'native') {
		var $a = $('<a>', {href: theme.location, text:'GitHub'});
		$div.append($a);
	    }
	    return $div;
	}
    };

    $(document).ready(function() {
	var filterView = new FilterView();
	var galleryView = new GalleryView(filterView.getSelectedFilter());
    });
})(jQuery);
