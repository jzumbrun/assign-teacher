/**
 * AppController
 *
 */
app.controller('AppController', ['$rootScope','$scope','$route','$config', '$timeout','$history', '$location',
	function ($rootScope, $scope, $route, $config, $timeout, $history, $location) {

		/* Redirect
		 * Redirect to another route
		 *
		 */
		$scope.redirect = function(route) {
			// defalt we load route content
			$timeout(function(){
				$scope.$apply(function() {

					if(route == 'back'){
						$history.back();
					}else{
						$location.path(route);
					}
					
				});
			}, 0);
		};

		/* Reload
		 * Reload the route
		 *
		 */
		$scope.reload = function() {
			$route.reload();
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

		Object.defineProperty(Array.prototype, "remove", {
			enumerable: false,
			value: function (remove) {
				this.splice( this.indexOf(remove), 1 );
			}
		});

		Object.defineProperty(Array.prototype, "exists", {
			enumerable: false,
			value: function (exists) {
				return this.indexOf(exists) > -1;
			}
		});
	}

]);