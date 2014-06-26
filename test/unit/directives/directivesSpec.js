//
// test/unit/directives/directivesSpec.js
//
describe("Unit: Testing Directives", function() {

  var $compile, $rootScope;

  beforeEach(angular.mock.module('app'));
  afterEach(function(){
    console.info(this.currentTest.fullTitle());
  });

  beforeEach(inject(
    ['$compile','$rootScope', function($c, $r) {
      $compile = $c;
      $rootScope = $r;
    }]
  ));

  it("should display a button properly", function() {
    var element = $compile('<div dir-button="{icon: \'plus-sign\'}"></div>')($rootScope);
    expect(element.html()).to.contain('glyphicon-plus-sign');
  })

});
