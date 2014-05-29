/**
 * AppController
 *
 */
app.controller('AppController', ['$rootScope','$scope','$route','$config','$location', '$timeout',
	function ($rootScope, $scope, $route, $config, $location, $timeout) {

		/* Redirect
		 * Redirect to another route
		 *
		 */
		$scope.redirect = function(route) {
			// defalt we load route content
			$timeout(function(){
				$scope.$apply(function() {

					console.log('route',route);
					$location.path(route);
				});
			}, 0);
		};

		/* Set
		 * Set a value to the scope
		 *
		 */
		$scope.set = function(set, value, apply) {
			apply = apply || false;

			if(apply){
				$scope.$apply(function() {
					$scope[set] = value;
				});
			}else{
				$scope[set] = value;
			}
			
		};

		/* Set Root
		 * Set a value to the scope
		 *
		 */
		$scope.setRoot = function(set, value, apply) {
			apply = apply || false;

			if(apply){
				$rootScope.$apply(function() {
					$rootScope[set] = value;
				});
			}else{
				$rootScope[set] = value;
			}
			
		};

		/* Partial
		 * Sets partial url
		 *
		 */
		$scope.partial = function(partial) {

			// defalt we load route content
			if(angular.isUndefined(partial) && $route.current['partial'] !== ''){
				return $route.current['partial'];
			}
			return $config.template(partial + '.html');
		};

		/* Capitalize
		 * Capitalize first letter
		 *
		 */
		$scope.capitalize = function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
		};

	}

]);