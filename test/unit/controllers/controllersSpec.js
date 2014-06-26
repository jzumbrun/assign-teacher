//
// test/unit/controllers/controllersSpec.js
//
describe("Unit: Testing Controllers", function() {

  beforeEach(angular.mock.module('app'));
  afterEach(function(){
      console.info(this.currentTest.fullTitle());
  });

  it('should have a Members controller', function() {
    expect(app.MembersController).not.to.equal(null);
  });

  it('should have a Visits controller', function() {
    expect(app.VisitsController).not.to.equal(null);
  });

  it('should have a properly working Members controller', inject(function($rootScope, $controller) {

    var $scope = $rootScope.$new();
    var ctrl = $controller('MembersController', {
      $scope : $scope,
      $routeParams : {}
    });
  }));

  it('should have a properly working Visits controller', inject(function($rootScope, $controller) {

    var $scope = $rootScope.$new();
    var ctrl = $controller('VisitsController', {
      $scope : $scope,
      $routeParams : {}
    });
  }));

});
