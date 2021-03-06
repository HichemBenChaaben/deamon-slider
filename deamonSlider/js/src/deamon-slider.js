// The comma at the beginning is not a mistake
// it help protect against unclosed functions
// when you concatenate the file
;(function ($, window, document, undefined) {
    "use strict";
    var pluginName = "deamonSlider",
        defaults = {
            activeIndex: 0,
            dsSlideClass : "ds-slide",
            enableKeyBoardNavigation: true,
            hightlightedClassName : "hightlighted",
            imagesCollection : {},
            staticPath: "deamonSlider/gallery",
            thumbCollection: {},
            thumbContainerClass: "ds-thumbDimentions",
            thumbsClass: "ds-isthumb",
            thumbsClassHeight: 50,
            thumbsClassWidth: 90,
            transitionTime: 400,
            useThumbnails: true,
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

            // Get the thumbs
            this.getAllThumbs(this.options.staticPath,
                                this.options.thumbCollection,
                                this.options.thumbsClass);

            // create all slides
            this.getAllImages(this.options.staticPath,
                                this.options.imagesCollection);

            // start animating the slides
            this.animateSlide(this.options.transitionTime,
                                this.options.imagesCollection.length,
                                this.options.enableKeyBoardNavigation);
            // call to the full screen handler
            this.fullScreenHandler($("#ds-caption"));
            this.getJsonFile();
        },
        getJsonFile: function() {
            var self = this;
            // Get the json file and parse it
            $.ajax({
                    type: "Get",
                    cache: false,
                    url: "../gallery.json"
                })
                .done(function(data) {
                    // json loaded successfully
                    // self.getAllThumbs(data);
                })
                .fail(function(){
                    // console.log("failed");
                    // json failed
                });
        },
        getAllImages: function(path, imagesColection) {
            var partialPath = path + "/",
                $sliderID = $("#ds-main"),
                imageCount = 0;
            // preload images 
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
                });
            });
            // Add animated class to the arrows
            $(".ds-arrow").addClass("ds-animate-height");
            // Update the image count
            this.updateCount(imageCount);
        },
        updateCount: function(arg) {
            // update the global count object and
            // default assign the active index
            return self.imageCount = arg, self.activeIndex = 0;
        },
        preloadAllThumbs:function(path, thumbCollection) {
            var manifest = [],
                i = 0,
                preLoadJs = "deamonSlider/js/lib/preloadjs-0.4.0.min.js";

            $.getScript(preLoadJs, function() {
               //do magic
               // fill the manifest with shit
               for(;i--;) {
                   manifest.push(path + "/" + thumbCollection[i]);
                   console.log("The manifest value is" + mainfest[i]);
               }
               // Create a preloader. There is no manifest added to it up-front,
               // we will add items on-demand.
               //change "" to add base path
                var preload = new createjs.LoadQueue(true, ""),
                    $mainProgress = $("#mainProgress"),
                    $progressBar = $mainProgress.find(".progress");
                    $progressBar.width(0);
                preload.addEventListener("progress", function() {
                    $progressBar.width(preload.progress * $mainProgress.width());
                });
                //complete callback
                preload.addEventListener("complete", function() {
                //console.log("ASSETS PRELOADED...");
                });
                preload.setMaxConnections(5);
                preload.loadManifest(manifest);
            });
        },
        getAllThumbs: function(path, thumbCollection, thumbsClass) {
            // Build full path to the image
            var partialPath = path + "/";
            // Preload everything
            $.preload = function() {
                var tmp = [],
                    i = partialPath + "/" + thumbCollection.length;
                for(;i--;)tmp.push($('<img />').attr('src',thumbCollection[i]));
            };
            // Call preload method
            this.preloadAllThumbs(path, thumbCollection);
            // loop threw the collection of images and insert them
            $.each(thumbCollection, function(index, value) {
                var newSource = $("<img/>").attr({"src": partialPath + "/" + value}),
                    newSpan = $("<span class=\"ds-thumbDimentions\"/>");
                //$.preload();
                // insert the new span on the thumbs div
                $("[class=\"" + thumbsClass + "\"]").append(newSpan);
                // Insert the new brand new span
                $(newSpan).append(newSource);
            });
            // highlight the first thumbnail image on the thumbCollection
            $(".ds-thumbDimentions").eq(0).addClass("hightlighted");
        },
        animateSlide: function() {
            // which index is currently selected ?
            var self = this,
                // the width of the slide ?
                $slideSegment = $(".ds-slide").width(),
                $thumbElement = $(".ds-thumbDimentions"),
                $dsLeft= $("#ds-left"),
                $dsRight = $("#ds-right"),
                $hightlightedIndex = $(".hightlighted").index();
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
            // Arrow keys handlers evaluate right left keypress
            if (this.options.enableKeyBoardNavigation) {
                // more elegant return
                return (function() {
                    $(document).keyup(function(e) {
                        var key = e.keyCode,
                            newIndex = $(".hightlighted").index();
                        // wait for the end of animations to trigger a new one
                        if ($("[class=\"" + self.options.dsSlideClass + "\"]").is(":animated")) {
                            return false;
                        }
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
                })();
            }
        },
        // function which animates a slide
        // from the right to the left
        animateLeft: function(slideAmount, slideDuration, newIndex) {
            // update the slideIndex value
            this.updateSlideIndex(newIndex);
            if (self.activeIndex >= 0) {
                return  this.Animate("-=", -slideAmount, slideDuration);
            } else {
                this.endOfAnimation("left");
            }
            
        },
        animateRight: function(slideAmount, slideDuration, newIndex) {
            this.updateSlideIndex(newIndex);
            if (self.activeIndex >= 0 && self.activeIndex < self.imageCount) {
                return this.Animate("-=", slideAmount, slideDuration);
            } else {
                this.endOfAnimation("right", slideAmount, slideDuration);
            }  
        },
        endOfAnimation: function(arg ,slideAmount, slideDuration) {
            console.log("end of animation");
        },
        // we will pass the amount to animate
        // then this function will animate for us
        Animate: function(slideDirection, slideAmount, slideDuration) {
            var slideValue = slideDirection + slideAmount,
                $dsSlide = $('.ds-slide'),
                $dsArrowId = $(".ds-arrow"),
                $dsSlideClass = $(".ds-slide"),
                endTransitionsEvents = "webkitTransitionEnd moztransitionend transitionend oTransitionEnd",
                heightAmount = $(".ds-slide img").eq($(".hightlighted").index()).height();

            if(!$dsSlide.hasClass("ds-animate-slide")) {
                $dsSlide.addClass("ds-animate-slide");
            }
            window.setTimeout(function() {
                // animate the height of the right and left controllers
                $dsArrowId.css({height: heightAmount});
                // update the active index value
                $dsSlideClass.css({ left: slideValue + "px"})
                    .eq(0)
                    .one(endTransitionsEvents, function() {
                       // animation ended
                });
            }, 1);
            /*
                // ! To do polyfill for non css translations
                window.setTimeout(function() {
                    $(".ds-slide").animate({ left: slideValue + "px"}, slideDuration, "easeInOutExpo");
                }, 10000);
            */
        },
        // Updating the slide index value
        updateSlideIndex: function(newIndex) {
            // the argument passed here is the straight away value
            // of the new index, we can set directly the new highlighted element
            // adding the hightlighted class to the right element
            var totalImages = self.imageCount,
                i = 0,
                hightlightedClassName = "hightlighted";

            if (newIndex < 0 || newIndex > totalImages ) {
                self.activeIndex = -1;
                return false;
            }
            // removing the old hightlighted class and apply it to the new index
            $(".ds-thumbDimentions")
                .removeClass(hightlightedClassName)
                .eq(newIndex).addClass(hightlightedClassName);
            // get the index of the hightlighted element
            self.activeIndex = $(".hightlighted").index();
        },
        fullScreenHandler : function(arg) {
            // function handling fullscreen Api
            arg.click(function() {
                if(!$("#slider").fullScreen()) {
                    throw ("Full screen dependency missing");
                }
            });
        },
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
