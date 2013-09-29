/**
    The semicollon at the beginning is protecting 
    against unclosed scripts after concatenation 
    and minification if you are going to do it
*/
;(function ($, window, document, undefined) {
    "use strict";

    var pluginName = "deamonSlider",
        defaults = {
            classSelector: ".bp-image",
            staticPath: "deamonSlider/images",
            thumbsClass: "ds-isthumb",
            thumbsClassHeight: 50,
            thumbsClassWidth: 90,
            imageCollection : {
                image1: "Loveman-Photography4-640x426.jpg",
                image2:"Loveman-Photography5-640x426.jpg",
                image3: "Loveman-Photography6-640x426.jpg",
                image4: "Loveman-Photography8-640x426.jpg",
                image5: "Loveman-Photography9-640x426.jpg"
            }
        };

    // Plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }
    // The main action goes here
    Plugin.prototype = {
        init: function () {
            // Initiation logic goes here 
            // You can access directly the DOM from this function
            // You can access current scope with this.element and this.options

            // Get the first image
            this.FirstImage(this.options.staticPath,
                            this.options.imageCollection);

            // Get the thumbs
            this.getAllThumbs(this.options.staticPath,
                                this.options.imageCollection,
                                this.options.thumbsClass);
        },
        FirstImage: function(path, collection) {

            // get the first image
            var newSlide = $("<img/>").attr({
                    'src': path + '/' + collection.image1
                });

            // Append the created image to the main element
            $('#ds-main').find('.ds-slide').append(newSlide);
        },
        getAllThumbs: function(path, collection, thumbsClass, thumbsClassWidth, thumbsClassHeight) {
        	// Build full path to the image
            var partialPath = path + '/';

            // loop threw the collection of images and insert them
        	$.each(collection, function( index, value ) {

                // create a new span element and a new span
                var newSpan = $("<span/>").addClass('ds-thumbDimentions'),
                    //Create a new image based on the url fetched from
                    newSource = $("<img/>").attr({
                        'src': partialPath + value
                    });

                // insert the new span on the thumbs div
                $('[class=\"' + thumbsClass + '\"]').append(newSpan);

                // Insert the new brand new span
                $(newSpan).append(newSource);
            });

            // highlight the first image on the collection
            $(".ds-thumbDimentions").eq(0)
                                    .addClass('hightleghted')
                                    .find('img')
                                    .fadeTo(0.2);
        }
    };

    // Prevent multiple instanciations 
    // keeping the plugin fast in execution
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

    // This is here for test purpose but you dont have really 
    // to do it
    $(function () {
        $(document).deamonSlider();
    });

})(jQuery, window, document);
