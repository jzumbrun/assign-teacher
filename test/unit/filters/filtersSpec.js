//
// test/unit/filters/filtersSpec.js
//
describe("Unit: Testing Filters", function() {

  beforeEach(angular.mock.module('app'));
  afterEach(function(){
      console.info(this.currentTest.fullTitle());
  });
  
  it('should have a capitalize filter', inject(function($filter) {
    expect($filter('capitalize')).not.to.equal(null);
  }));

  it('should have a capitalize filter that capitalizes a string', inject(function($filter) {
    var string = $filter('capitalize')('hello');
    expect(string).to.equal('Hello');
  }));

});
