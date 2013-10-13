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
                hightlightedClassName = this.options.hightlightedClassName;

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
            // update the global count object and
            // default assign the active index
            return self.imageCount = arg, self.activeIndex = 0;
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
                                     .addClass("hightlighted")
                                     .find("img")
                                     .fadeTo(0.2);
        },
        animateSlide: function() {
            // which index is currently selected ?
            var self = this,
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
                var slideAmount = ( $(this).index() - $(".hightlighted").index()) * $slideSegment,
                    // in case you want to slide backwards you need to pass a
                    // negative value
                    slideToIndex = $(this).index() - $(".hightlighted").index();
                // If slideAmount is positive animate right
                // otherwise animate left
                return (slideAmount > 0 ?
                    self.animateRight(slideAmount, self.slideDuration, $(this).index()):
                    self.animateLeft(-slideAmount, self.slideDuration, $(this).index()));
            });
            // Arrow click handler on the right arrow
            $("#ds-main").find("span").find("img").click(function() {
                // handle the exeption of the last element
                var newIndex = $(".hightlighted").index() + 1;
                // display the next image
                self.animateRight($slideSegment, self.slideDuration, newIndex);
            });
            // click on arrows handlers
            $dsLeft.click(function() {
                // handle the exeption of the last index
                var newIndex = $(".hightlighted").index() - 1;
                // display the hightlighted index element
                // if its not the last element then animate it
                self.animateLeft($slideSegment, self.slideDuration, newIndex);
            });
            // Arrow click handler on the left arrow
            $dsRight.click(function(collectionLength) {
                // get the index of the hightlighted class
                var newIndex = $(".hightlighted").index() + 1;
                // display the hightlighted index element
                // if its not the first element then animate it
                self.animateRight($slideSegment, self.slideDuration, newIndex);
                // update the slide index using the current value and the
            });
            // TOUCH AND TAP HANDLERS

            // Arrow keys handlers evaluate right left keypress
            $(document).keyup(function(e) {
                var key = e.keyCode,
                    newIndex = $(".hightlighted").index();
                // this will evaluate the keyPressed 
                // and then run the appropriate function
                if (key === 39) {
                    return newIndex = newIndex + 1,
                            self.animateRight($slideSegment, self.slideDuration, newIndex);
                } else if (key === 37) {
                    return newIndex = newIndex - 1,
                            self.animateLeft($slideSegment, self.slideDuration, newIndex);
                } else {
                    return false;
                }
            });
        },
        // function which animates a slide
        // from the right to the left
        animateLeft: function(slideAmount, slideDuration, newIndex) {
            // update the slideIndex value
            this.updateSlideIndex(newIndex);
            return (self.activeIndex >= 0 ?
                    this.Animate("-=", -slideAmount, slideDuration):
                    false);
        },
        animateRight: function(slideAmount, slideDuration, newIndex) {
            this.updateSlideIndex(newIndex);
            return (self.activeIndex < self.imageCount ?
                    this.Animate("-=", slideAmount, slideDuration) :
                    false);
        },
        // we will pass the amount to animate
        // then this function will animate for us
        Animate: function(slideDirection, slideAmount, slideDuration) {
            // update the active index value
            return $(".ds-slide").animate({ left: slideDirection + slideAmount + "px"
                    }, slideDuration, "easeInOutExpo"),
                    $(".ds-arrow").animate({"height": $(".ds-slide").find("img").height()
                    }, self.slideDuration, "easeInOutExpo");
        },
        // Updating the slide index value
        updateSlideIndex: function(newIndex) {
            // the argument passed here is the straight away value
            // of the new index, we can set directly the new highlighted element
            // adding the hightlighted class to the right element
            var totalImages = self.imageCount;
            if(newIndex >= 0 && newIndex < totalImages ) {
                $(".ds-thumbDimentions").each(function() {
                    $(this).removeClass("hightlighted");
                });
                $(".ds-thumbDimentions").eq(newIndex).addClass("hightlighted");
                // now the new value of active index is the new hightlighted element
                self.activeIndex = $(".hightlighted").index();
            }
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
