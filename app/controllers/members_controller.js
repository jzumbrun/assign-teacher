/**
 * MembersController
 *
 */
app.controller('MembersController', ['$scope','$routeParams','$config','$location','$filter','Member',
	function ($scope, $routeParams, $config, $location, $filter, Member) {

		var self = this;

		$scope.index = function(){
			$scope.setRoot('title', 'Members');
			$scope.table();
		};

		$scope.add = function(){
			$scope.setRoot('title', 'Add Member');
		};

		$scope.import = function(){
			$scope.setRoot('title', 'Import Members');
		};

		$scope.save = function(){

			// import
			if($scope.import && $scope.import.length){
				Member.insert($scope.import);
				$scope.redirect('/members');
			}
			// update
			else if($scope.member.___id){
				console.log('update');
				Member.update( $scope.member );

				if($scope.relation){
					Member['set' + $scope.capitalize($scope.relation)]($scope.member, $scope.selected);
					$scope.redirect('/members/' + $scope.member.___id + '/edit');
				}
				else{
					$scope.redirect('/members');
				}
			}
			// add
			else{
				Member.insert($scope.member);
				$scope.redirect('/members');
			}

		};

		$scope.makeSenior = function(){
			// inverse the seniority
			$scope.member.is_senior = !$scope.member.is_senior;
			// check for other companions etc
			// exchange ownership of families
			// and companions, etc

			Member.update( $scope.member );

			$scope.reload();
		};

		$scope.edit = function(){
			$scope.setRoot('title', 'Edit Member');
			$scope.member = Member.get($routeParams.id);
			$scope.families = Member.getFamilies($scope.member);
			$scope.teachers = Member.getTeachers($scope.member);
			$scope.companions = Member.getCompanions($scope.member);
		};

		$scope.assign = function(){
			$scope.setRoot('title', 'Assign ' + $scope.capitalize($routeParams.type));
			$scope.relation = $routeParams.type;
			$scope.member = Member.get($routeParams.id);
			$scope.selected = Member['get' + $scope.capitalize($scope.relation)]($scope.member, '___id');
			$scope.table();
		};

		$scope.delete = function(){
			Member.remove($scope.member);
			$scope.redirect('/members');
		};

		$scope.table = function(options){
			options = options || {};
			$scope.members = []; // keep here

			var query = function(){
				var search = {},
				tokens = [];

				if(options.search){
					tokens = options.search.split(':');

					// general like search
					if(tokens.length === 1){
						return {household:{likenocase: tokens}};
					}

					try{
						search = $scope.$eval('{' + options.search + '}');
					}finally {
						// warn -- for latter
					}

					return search;
				}
				return; // return void
			};

			Member.get(query())
			.then(function(members){
				console.log('members', members);
				//Member.remove();
				$scope.members = members; // keep here
				if(!$scope.members.length && !angular.isUndefined(options.search)){
					$scope.members = [];
				}
				else if(!$scope.members.length) {
					$scope.redirect("/members/import");
				}
			});
		};
	}
]);