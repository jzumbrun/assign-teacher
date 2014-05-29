
////////////////////// START APP //////////////////////
var app = angular.module('app', [
  'config',
  'ngResource',
  'ngRoute',
  'ui-gravatar'
]);

app.config(['$configProvider','$routeProvider', function($configProvider, $routeProvider) {

	$routeProvider.
		when('/', {
			controller: 'MembersController',
			method: 'index',
			templateUrl: $configProvider.template('members/index.html'),
		});

	$routeProvider.
		when('/members/add', {
			controller: 'MembersController',
			method: 'add',
			templateUrl: $configProvider.template('members/form.html'),
		});

	$routeProvider.
		when('/members/import', {
			controller: 'MembersController',
			method: 'import',
			templateUrl: $configProvider.template('members/import.html'),
		});

	$routeProvider.
		when('/members/:id/edit', {
			controller: 'MembersController',
			method: 'edit',
			templateUrl: $configProvider.template('members/form.html'),
		});

	$routeProvider.
		when('/members/:id/assign/:type', {
			controller: 'MembersController',
			method: 'assign',
			templateUrl: $configProvider.template('members/assign.html'),
		});

	$routeProvider.
		otherwise({redirectTo: '/'});

	// load the database
}]);