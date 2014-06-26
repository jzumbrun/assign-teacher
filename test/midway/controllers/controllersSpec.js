//
// test/midway/controllers/controllersSpec.js
//
describe("Midway: Testing Controllers", function() {

  var tester;
  beforeEach(function() {
    if(tester) {
      tester.destroy();
    }
    tester = ngMidwayTester('App');
  });
  afterEach(function(){
      console.info(this.currentTest.fullTitle());
  });

  it('should load the Members controller properly when /index route is accessed', function(done) {
    tester.visit('/Members', function() {
      tester.path().should.eq('/Members');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
      expect(controller).to.eql('Members');
      done();
    });
  });

  it('should load the Visits controller properly when /index route is accessed', function(done) {
    tester.visit('/index', function() {
      tester.path().should.eq('/index');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var params = current.params;
      var scope = current.scope;

      expect(controller).to.equal('Visits');
      done();
    });
  });

});
