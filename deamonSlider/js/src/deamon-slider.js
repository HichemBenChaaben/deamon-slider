/**
    The semicolon is not a mistake, when you concatenate this file
    it will protect your combined files from erorrs
    if other files or the minificator acceidently is not adding ;
    at the end 
*/

;(function ($, window, undefined) {
    
    var pluginName = 'deamonslider',
        document = window.document,
        defaults = {
            propertyName: "value"
        };

    function Plugin(element, options ) {
        this.element = element;
        this.options = $.extend({}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function() {

    };

    // keep it lightweight disabling multiple instanciantions
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }

}(jQuery, window));