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
  };
});

/* Capitalize
 * Capitalize first letter
 *
 */
app.filter('capitalize', function() {
  return function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
});

/* Truncate a string
 * http://stackoverflow.com/a/18096071/250991
 */
app.filter('truncate', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });