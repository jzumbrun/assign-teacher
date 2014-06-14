'use strict';

app.factory('Visit', ['$taffy', '$q',function($taffy, $q){

	var visits = function(){
		var self = this;
		self.db = $taffy.db();
		
		self.db.settings({
			name:'visits',
			template:{
				member_id: '',
				date: '',
				type: '',
				note: ''
			}
		});

		self.insert = function(record){
			// import
			if(angular.isObject(record)){
				self.db.insert(record);
			}
		};

		self.update = function(record, callback){

			if(angular.isFunction(callback)){
				// "record" is the query now
				self.db(record).update(callback);
			}else{
				self.db(record.___id).update(record);
			}
		};

		self.remove = function(record){
			if(record){
				self.db(record.___id).remove();
			}
			else{
				self.db().remove();
			}
		};

		self.get = function(query){
			var deferred, get;
			// single id
			if(angular.isString(query)){
				return self.db(query).first();
			}
			else{
				deferred = $q.defer();
				
				if(angular.isObject(query)){
					get = self.db(query).order('date desc').get();
				}
				else{
					get = self.db().order('date desc').get();
				}
				
				// see if we have records in the localStorage
				if(!get.length){
					self.db.store().then(function(db){
						get = db().order('date desc').get();
						console.log('Visits get',get);
						deferred.resolve(get);
					});
				}else{
					deferred.resolve(get);
				}

				return deferred.promise;
			}
		};
	};

	return new visits();
}]);