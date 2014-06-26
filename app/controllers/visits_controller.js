/**
 * MembersController
 *
 */
app.controller('VisitsController', ['$scope','$routeParams','Visit',
	function ($scope, $routeParams,Visit) {

		var self = this;

		$scope.add = function(){
			$scope.setRoot('title', 'Add Visit');
			$scope.visit = {};
		};

		$scope.save = function(){
			// update
			if($scope.visit.___id){
				Visit.update( $scope.visit );
				$scope.redirect('back');
			}
			// add
			else{
				$scope.visit.member_id = $routeParams.member_id;
				Visit.insert($scope.visit);
				$scope.redirect('back');
			}
		};

		$scope.edit = function(){
			$scope.setRoot('title', 'Edit Visit');
			$scope.visit = Visit.get($routeParams.id);
			$scope.visit.type = 'phone';
		};

		$scope.delete = function(){
			Visit.remove($scope.visit);
			$scope.redirect('back');
		};


		$scope.openCalendar = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.opened_calendar = true;
		};

		$scope.types = {
			'message': 'Message',
			'phone': 'Phone' ,
			'visit': 'Visit' ,
			'lesson': 'Lesson'
		};
	}
]);