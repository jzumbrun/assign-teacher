//
// test/unit/services/librariesSpec.js
//
describe("Unit: Testing Libraries", function() {

  beforeEach(angular.mock.module('app'));
  afterEach(function(){
      console.info(this.currentTest.fullTitle());
  });
  
  it('should contain an geolib service', inject(function(geolib) {
    expect(geolib).not.to.equal(null);
  }));

  it('should contain an imports service', inject(function(imports) {
    expect(imports).not.to.equal(null);
  }));

  // it('should have a working imports service', inject(['imports',function($yt) {
  //   expect($yt.prefixKey).not.to.equal(null);
  //   expect($yt.resize).not.to.equal(null);
  //   expect($yt.prepareImage).not.to.equal(null);
  //   expect($yt.getWatchedVideos).not.to.equal(null);
  // }]));

});
