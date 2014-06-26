//
// test/midway/routesSpec.js
//
describe("Midway: Testing Routes", function() {

  var tester;
  beforeEach(function() {
    tester = ngMidwayTester('App');
  });

  afterEach(function() {
    console.info(this.currentTest.fullTitle());
    tester.destroy();
    tester = null;
  });

  // it("should have a working videos_path route", function() {
  //   expect(ROUTER.routeDefined('videos_path')).to.equal(true);
  //   var url = ROUTER.routePath('videos_path');
  //   expect(url).to.equal('/videos');
  // });

  // it("should have a videos_path route that should goto the VideosCtrl controller", function() {
  //   var route = ROUTER.getRoute('videos_path');
  //   route.params.controller.should.equal('VideosCtrl');
  // });

});
