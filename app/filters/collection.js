app.filter('uri_segments', function($location) {
  return function(segment) {
    // Get URI and remove the domain base url global var
    var query = $location.absUrl();
    // To obj
    // 0 = protocol, 1 = '', 2 = host
    var data = query.split("/").slice(2); 
    // Return segment *segments are 1,2,3 keys are 0,1,2
    if(data[segment]) {
      return data[segment];
    }
    return false;
  }
});