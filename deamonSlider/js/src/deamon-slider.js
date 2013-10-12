(function ($, window, document, undefined) {
    "use strict";
    var pluginName = "deamonSlider",
        defaults = {
            classSelector: ".bp-image",
            staticPath: "deamonSlider/images",
            thumbsClass: "ds-isthumb",
            thumbsClassHeight: 50,
            thumbsClassWidth: 90,
            transitionTime: 400,
            imagesCollection : {},
            thumbCollection: {}
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
            var self = this;
            // Initiation logic goes here 
            // You can access directly the DOM from this function
            // You can access current scope with this.element and this.options
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
                $sliderID = $("#ds-main");
            // Loop threw image collection
            $.each(imagesColection, function(index, value) {
                // create an image element with attr source of it
                var newSlide = $("<span/>").addClass("ds-slide");
                newSlide.append($("<img/>").attr({"src": partialPath + value}));
                $sliderID.append(newSlide);
            });
            // position all images on the canvas and then animate them
            $(".ds-slide").each(function(index) {
                console.log("the first value is:" + $(this).width() * index);
                $(this).css({
                    left: $("#ds-main").width() * index,
                    height: "auto"
                });
            });
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
        animateSlide: function(arg, collectionLength) {
            // which index is currently selected ?
            var self = this,
                slideIndex = $(".hightlighted").index(),
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
                    slideToIndex = $(this).index() - $(".hightlighted").index();
                slideIndex = $(this).index();
                // remove the hightlighted class from all the elements
                // and updated with the clicked thumbnail
                // this will be used on other behaviours as well
                $(".ds-thumbDimentions").each(function() {
                    $(this).removeClass("hightlighted");
                });
                $(this).addClass("hightlighted");
                // animate right or left ?
                return (slideAmount > 0 ?
                    self.animateRight(slideAmount, 400):
                    self.animateLeft(-slideAmount, 400));
            });
            // Arrow click handler on the right arrow
            $("#ds-main").find("span").find("img").click(function() {
                // when click on the main area always display the next
                // image
                self.animateRight($slideSegment, 400);
            });
            $dsLeft.click(function(collectionLength) {
                var $highlightedIndex = $(".hightlighted").index();
                // display the hightlighted index element
                //console.log("The index of the highlighted element is " + $highlightedIndex);
                // if its not the last element then animate it
                self.animateLeft($slideSegment, 400, null);
                slideIndex++;
            });
            // Arrow click handler on the left arrow
            $dsRight.click(function(collectionLength) {
                var $hightlightedIndex = $(".hightlighted").index();
                // display the hightlighted index element
                // if its not the first element then animate it
                self.animateRight($slideSegment, 400, collectionLength);
                slideIndex--;
            });
            // TOUCH HANDLERS
            /*
                handle swipe right
                handle swipe left
                handle swipe tap
            */
            // Arrow keys handlers evaluate right left keypress
            $("html", document, window).keyup(function(e) {
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
        animateLeft: function(slideAmount, slideDuration, slideToIndex) {
            return this.Animate("-=", -slideAmount, slideDuration);
        },
        // function which animate a slide 
        // from the left to the right
        animateRight: function(slideAmount, slideDuration) { 
            return this.Animate("-=", slideAmount, slideDuration);
        },
        // we will pass the amount to animate
        // then this function will animate for us
        Animate: function(slideDirection, slideAmount, slideDuration) {
            // if an older browser, fall back to jQuery animate
            return $(".ds-slide").animate({
                    // arg is slideamount
                    left: slideDirection + slideAmount + "px"
                }, slideDuration, "easeInOutExpo"), 
                $(".ds-arrow").animate({
                    "height": $(".ds-slide img").height()
                    }, 400, "easeInOutExpo");
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
