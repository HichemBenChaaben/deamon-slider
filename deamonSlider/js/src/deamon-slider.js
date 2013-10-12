// The comma at the beginning is not a mistake
// it help protect against unclosed functions
// when you concatenate the file
;(function ($, window, document, undefined) {
    "use strict";
    // Plugin definition name and
    // defaults variables
    var pluginName = "deamonSlider",
        defaults = {
            classSelector: ".bp-image",
            staticPath: "deamonSlider/images",
            thumbsClass: "ds-isthumb",
            thumbsClassHeight: 50,
            thumbsClassWidth: 90,
            transitionTime: 400,
            imagesCollection : {},
            thumbCollection: {},
            dsSlideClass : "ds-slide",
            hightlightedClassName : "hightlighted"
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
        init: function() {
            var self = this,
                activeIndex = 0,
                imageCount = 0,
                slideDuration = this.options.transitionTime,
                dsSlideClass = this.options.dsSlideClass,
                hightlightedClassName = hightlightedClassName;

            // create all slides
            this.getAllImages(this.options.staticPath,
                                this.options.imagesCollection);
            // Get the thumbs
            this.getAllThumbs(this.options.staticPath,
                                this.options.thumbCollection,
                                this.options.thumbsClass);
            // start animating the slides
            this.animateSlide(this.options.transitionTime,
                                this.options.imagesCollection.length);
        },
        getAllImages: function(path, imagesColection) {
            var partialPath = path + "/",
                $sliderID = $("#ds-main"),
                imageCount = 0;
            // Loop threw image collection
            $.each(imagesColection, function(index, value) {
                // create an image element with attr source of it
                var newSlide = $("<span/>").addClass("ds-slide");
                newSlide.append($("<img/>").attr({"src": partialPath + value}));
                $sliderID.append(newSlide);
                imageCount++;
            });
            // position all images on the canvas and then animate them
            $(".ds-slide").each(function(index) {
                $(this).css({
                    left: $("#ds-main").width() * index,
                    height: "auto"
                });
            });
            this.updateCount(imageCount);
        },
        updateCount: function(arg) {
            // update the global count object
            self.imageCount = arg;
        },
        getAllThumbs: function(path, thumbCollection, thumbsClass) {
            // Build full path to the image
            var partialPath = path + "/";
            // loop threw the collection of images and insert them
            $.each(thumbCollection, function(index, value) {
                var newSource = $("<img/>").attr({"src": partialPath + "/" + value}),
                    newSpan = $("<span class=\"ds-thumbDimentions\"/>");
                // insert the new span on the thumbs div
                $("[class=\"" + thumbsClass + "\"]").append(newSpan);
                // Insert the new brand new span
                $(newSpan).append(newSource);
            });
            // highlight the first thumbnail image on the thumbCollection
            $(".ds-thumbDimentions").eq(0)
                                     .addClass(self.hightlightedClassName)
                                     .find("img")
                                     .fadeTo(0.2);
        },
        animateSlide: function() {
            // which index is currently selected ?
            var self = this,
                slideIndex = $("[class=" + self.hightlightedClassName + "]").index(),
            // the width of the slide ?
                $slideSegment = $(".ds-slide").width(),
                $thumbElement = $(".ds-thumbDimentions"),
                $dsLeft       = $("#ds-left"),
                $dsRight      = $("#ds-right");
            // this function assumed that you have all slides already 
            // downloaded and ready to be served
            // it need to be plugged to an ajax http request
            // click handler on the thumb elements
            $thumbElement.click(function() {
                // change the index of the hightlighted element
                var slideAmount = ( $(this).index() - slideIndex ) * $slideSegment,
                    // in case you want to slide backwards you need to pass a
                    // negative value
                    slideToIndex = $(this).index() - $("[class=" + self.hightlightedClassName + "]").index();
                slideIndex = $(this).index();
                // remove the hightlighted class from all the elements
                // and updated with the clicked thumbnail
                // this will be used on other behaviours as well
                $(".ds-thumbDimentions").each(function() {
                    $(this).removeClass(self.hightlightedClassName);
                });
                $(this).addClass(self.hightlightedClassName);
                // If slideAmount is positive animate right
                // otherwise animate left
                return (slideAmount > 0 ?
                    self.animateRight(slideAmount, self.slideDuration):
                    self.animateLeft(-slideAmount, self.slideDuration));
            });
            // Arrow click handler on the right arrow
            $("#ds-main").find("img").click(function() {
                // when click on the main area always display the next
                // image
                self.animateRight($slideSegment, self.slideDuration);
            });
            $dsLeft.click(function() {
                // Get the index of the hightlighted element
                var $highlightedIndex = $("[class=" + self.hightlightedClassName + "]").index();
                // display the hightlighted index element
                // if its not the last element then animate it
                self.animateLeft($slideSegment, self.slideDuration, null);
                // call the function to update the current active index
                slideIndex++;
            });
            // Arrow click handler on the left arrow
            $dsRight.click(function(collectionLength) {
                // get the index of the hightlighted class
                var $hightlightedIndex = $("[class=" + self.hightlightedClassName + "]").index();
                // display the hightlighted index element
                // if its not the first element then animate it
                self.animateRight($slideSegment, self.slideDuration, collectionLength);
                // call the function to update the current active index
                slideIndex--;
            });
            // TOUCH AND TAP HANDLERS

            // Arrow keys handlers evaluate right left keypress
            $(document).keyup(function(e) {
                // this will evaluate the keyPressed 
                // and then run the appropriate function
                return ((e.keyCode === 39 || e.keyCode === 37) ?
                            (e.keyCode === 39 ? self.animateRight($slideSegment) :
                            self.animateLeft($slideSegment)) :
                        false);
            });
        },
        // function which animates a slide
        // from the right to the left
        animateLeft: function(slideAmount, slideDuration) {
            console.log("The global count of the images is " +  self.imageCount);
            console.log("The active index of the images is " +  self.activeIndex);
            return this.Animate("-=", -slideAmount, slideDuration);
        },
        // function which animate a slide 
        // from the left to the right
        animateRight: function(slideAmount, slideDuration) {
            console.log("The global count of the images is " +  self.imageCount);
            console.log("The active index of the images is " +  self.activeIndex);

            return this.Animate("-=", slideAmount, slideDuration);
        },
        // we will pass the amount to animate
        // then this function will animate for us
        Animate: function(slideDirection, slideAmount, slideDuration) {
            return $(".ds-slide").animate({
                    // arg is slideamount
                    left: slideDirection + slideAmount + "px"
                }, slideDuration, "easeInOutExpo"),
                $(".ds-arrow").animate({
                    // wrong find a proper way to fix it
                    "height": $(".ds-slide").find("img").height()
                    }, self.slideDuration, "easeInOutExpo");
        },
        updateActiveIndex: function(currentIndex, value) {
            // the value can eather be negative or positive
            // depends on the animation
            self.activeIndex = currentIndex + value;
        }
    };
    // Prevent multiple instanciations 
    // keeping the plugin fast in execution
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
