/**
 * MembersController
 *
 */
app.controller('MembersController', ['$scope','$routeParams','$config','$location','Member',
	function ($scope, $routeParams, $config, $location, Member) {

		var self = this;

		$scope.index = function(){
			$scope.setRoot('title', 'Members');
			$scope.set('members', []);
			$scope.set('import', []);
			$scope.table();
		};

		$scope.add = function(){
			$scope.setRoot('title', 'Add Member');
			$scope.set('members', []);
			$scope.set('import', []);
		};

		$scope.import = function(){
			$scope.setRoot('title', 'Import Members');
			$scope.set('members', []);
			$scope.set('import', []);
		};

		$scope.save = function(){

			// import
			if($scope.import && $scope.import.length){
				
				Member.bulkCreate($scope.import).success(function() {
					$scope.redirect("/members");
				});

				$scope.set('import', []);
			}
			// relations
			else if(angular.isArray($scope.members)){
				Member.find({ id : $scope.member.id })
				.then(function(member){

					var selected = [];
					$scope.members.forEach(function(mem){
						if(mem.selected){ selected.push(mem.id); }
					});

					if(selected.length){
						Member.findAll({where: {id: {in: selected}}})
						.then(function(relations){
							console.log('relations',relations);
							member['set' + $scope.relation](relations)
							.then(function(rels){
								$scope.redirect('/members/' + member.id + '/edit');
							});
						});
					}
					else{
						member['set' + $scope.relation](null)
						.then(function(rels){
							$scope.redirect('/members/' + member.id + '/edit');
						});
					}
				});
			}
			// update
			else if($scope.member.id){
				Member.update( $scope.member, { id : $scope.member.id })
				.then(function(member) {
					$scope.redirect("/members");
				});

			}
			// add
			else{
				Member.build($scope.member).save()
				.success(function(member){
					$scope.redirect("/members");
				});
			}

		};

		$scope.edit = function(){
			$scope.setRoot('title', 'Edit Member');
			$scope.families = [];
			$scope.companions = [];
			Member.find({ where: { id : parseInt($routeParams.id,10) } })
			.then(function(member) {
				$scope.set('member',member.dataValues, true);

				// families
				member.getFamilies()
				.then(function(families){
					$scope.$apply(function() {
						families.forEach(function(family){
							$scope.families.push(family.dataValues);
						});
					});
				});

				member.getCompanions()
				.then(function(companions){
					$scope.$apply(function() {
						companions.forEach(function(companion){
							$scope.companions.push(companion.dataValues);
						});
					});
				});

				// member.getTeachers()
				// .then(function(teachers){
				// 	$scope.$apply(function() {
				// 		teachers.forEach(function(teacher){
				// 			$scope.teachers.push(teacher.dataValues);
				// 		});
				// 	});
				// });

				// member.getVisits()
				// .then(function(visits){
				// 	$scope.$apply(function() {
				// 		visits.forEach(function(visit){
				// 			$scope.visit.push(visit.dataValues);
				// 		});
				// 	});
				// });

			});
		};

		$scope.assign = function(){
			var relation = $scope.capitalize($routeParams.type);

			$scope.set('relation', relation);
			$scope.setRoot('title', 'Assign ' + relation);

			Member.find({ id : parseInt($routeParams.id,10) })
			.then(function(member){
				$scope.set('member', member.dataValues, true);

				if(!angular.isFunction(member['get' + relation])){
					return false;
				}

				member['get' + relation]()
				.then(function(rels){
					// get the ids of the relations
					rels.forEach(function(rel){
						$scope.member.selected = true;
					});
					$scope.table({type: $routeParams.type});
				});
			});
		};

		$scope.delete = function(){
			Member.destroy({ id : $scope.member.id })
			.then(function(data){
				$scope.redirect("/members");
			});
		};

		$scope.table = function(options){
			options = options || {};
			$scope.set('members', []); // keep here

			Member.table(options)
			.then(function(members) {
				if(members.length){
					$scope.$apply(function() {
						members.forEach(function(member){
							$scope.members.push(member.dataValues);
						});
					});
				}
				else if(!angular.isUndefined(options.search)){
					$scope.setApply('members', []);
				}
				else {
					$scope.redirect("/members/import");
				}
			});
		};
	}
]);