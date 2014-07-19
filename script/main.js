(function ($, undefined) {
    "use strict";

    var themeProperties = {};
    
    themeProperties.rootFolder		= '../screenshots/';
    themeProperties.darkFolder		= themeProperties.rootFolder + 'dark/';
    themeProperties.lightFolder		= themeProperties.rootFolder + 'light/';
    themeProperties.imgExtension	=  '.png';
    themeProperties.themes = [
        {
	    name:'ample',
	    dark:true,
	    light:false
	},
	{
	    name: 'zenburn',
	    dark:true,
	    light:false
	},
	{
	    name: 'monokai',
	    dark: true,
	    light: false
	},
	{
	    name: 'adwaita',
	    dark: false,
	    light: true
	},
	{
	    name: 'light-blue',
	    dark: false,
	    light: true
	},
	{
	    name: 'tsdh-light',
	    dark: false,
	    light: true
	},
	{
	    name:'wombat',
	    dark: true,
	    light:false
	}];
    
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
	}
    ];

    var filter = {};

    function reloadTheme(filter) {
	var $galleryBody = $('#gallery tbody').html('<tr>');
	var themesLoaded = 0;
	for (var i = 0, themesLength = themeProperties.themes.length; i < themesLength; i++) {
	    var theme = themeProperties.themes[i];
	    var themeLocation;
	    var themesToAdd = [];
	    var language = $.grep(themeProperties.languages, function(language) {
	    	return (language.name === filter.language);
	    })[0];
	    //console.log(filter);
	    //console.log(language);
	    console.log(theme.light);
	    if (filter.dark && theme.dark) {
	    	themeLocation = themeProperties.darkFolder + theme.name + '/' +
	    	    language.extension + themeProperties.imgExtension;
	    	themesLoaded++;
	    	themesToAdd.push($('<img>', {src: themeLocation}));
	    }
	    
	    if (filter.light && theme.light) {
	    	themeLocation = themeProperties.lightFolder + theme.name + '/' +
	    	    language.extension + themeProperties.imgExtension;
	    	themesLoaded++;
	    	themesToAdd.push($('<img>', {src: themeLocation}));
	    }

	    for (var k = 0; k < themesToAdd.length; k++) {
	    	$galleryBody.find('tr:last').append($('<td>').append(themesToAdd[k]));
	    }
	    if (themesLoaded % 3 === 0) {
	    	$galleryBody.append('<tr> </tr>');
	    }
	}
    }
    
    function events() {
	$('#color').on('change', function() {
	    filter.dark = ($(this).val() === 'Dark');
	    filter.light = ($(this).val() === 'Light');
	    reloadTheme(filter);
	});
	$('#languagesAndModes').on('change', function() {
	    filter.language = $(this).val();
	    reloadTheme(filter);
	});
    }

    function init() {
	filter.dark = ($('#color').val() === 'Dark');
	filter.light = ($('#color').val() === 'Light');
	filter.language = $('#languagesAndModes').val();
	reloadTheme(filter);
	events();
    }

    init();
    
})(jQuery);

/*

/screenshots/dark/themeName/java.png
/screenshots/dark/themeName/c.png
/screenshots/dark/themeName/html.png
/screenshots/dark/themeName/js.png

/screenshots/light/themeName/

*/
