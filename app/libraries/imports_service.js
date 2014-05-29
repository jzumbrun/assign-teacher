app.factory('imports', [function() {

    var imports = {

        csv: function(file) {
            var Q = require('q'),
            fs = require('fs'),
            parse = require('csv-parse');

            var deferred = Q.defer();

            // Using the first line of the CSV data to discover the column names
            rs = fs.createReadStream(file);
            parser = parse({columns: function(columns){
                // snake case all the things
                columns.forEach(function(column, index){
                    columns[index] = column.replace('-','').replace(' ', '_').toLowerCase();
                });
                return columns;
            }}, function(err, data){
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(data);
                }
            });
            rs.pipe(parser);

            return deferred.promise;
        }

    };

    return imports;

}]);