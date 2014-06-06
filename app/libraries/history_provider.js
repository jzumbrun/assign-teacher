'use strict';

/* global -confModule */
angular.module('history', []).provider('$history', $historyProvider);

function $historyProvider(){

	var self = this;
	self.state = [];

	self.back = function($location) {

		if(self.state.length){
			
			// check is previous is actually the current url
			var previous = self.state[self.state.length-1];

			if('/'+ previous == $location.url()){
				previous = self.state.pop();
			}
			
			// lets get the actual previous now
			if(self.state.length){
				previous = self.state.pop();
			}else{
				$location.path('/');
				return;
			}
			$location.path(previous);
		}else{
			$location.path('/');
		}
	};

	self.pushState = function($location,url) {
			self.state.push(url);
			if(url == '/'){ // if root clear states
				self.state = [];
			}
			console.log('push',url);
			$location.path(url);
	};

	self.$get = function($location) {
			return {
				back: function() {
					return self.back($location);
				},
				pushState: function(url) {
					return self.pushState($location,url);
				}
			};
	};

}