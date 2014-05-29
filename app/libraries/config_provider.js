'use strict';

 /* global -confModule */
angular.module('config', []).
                        provider('$config', $configProvider);

function $configProvider(){

  var self = this,
   config = {
    template_prefix : null
   };

  self.template = function(url) {

    if(config.template_prefix == null){
        // template prefix
        config.template_prefix = 'views/';
    }

    return config.template_prefix + url;
    
  };

  self.$get = function() {
      return {
        template: function(url) {
          return self.template(url);
        }
      }
  };

}