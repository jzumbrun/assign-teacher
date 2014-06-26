'use strict';

/* global -confModule */
angular.module('history', []).provider('$history', $historyProvider);

function $historyProvider(){

	var self = this;
	self.state = [];

	self.back = function($location) {

		if(self.state.length){
			console.log('back', self.state);
			
			// check is previous is actually the current url
			var previous = self.state[self.state.length-1];

			if(previous == $location.url()){
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

	self.pushState = function(url) {
		console.log('pushState', url);
		
		self.state.push(url);
		if(url == '/'){ // if root clear states
			self.state = [];
		}
	};

	self.$get = function($rootScope, $location) {

		$rootScope.$on('$locationChangeSuccess', function(event) {
			self.pushState($location.url());
		});

		return {
			back: function() {
				return self.back($location);
			}
		};
	};

}