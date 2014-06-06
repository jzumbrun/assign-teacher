'use strict';

app.factory('Member', ['$taffy', '$q', function($taffy, $q){

	var members = function(){
		var self = this;
		self.db = $taffy.getCollection('members');

		self.undefineds = ['household'];
		
		self.db.settings({
			template:{
				first_name: '',
				last_name: '',
				city: '',
				email: '',
				household: '',
				latitude: '',
				location_status: '',
				longitude: '',
				phone: '',
				state: '',
				street: '',
				zip: '',
				hide: false,
				is_senior: false,
				senior: '',
				teacher: '',
				note: ''
			}
		});

		var undefineds = function(record){
			self.undefineds.forEach(function(u){
				if(angular.isUndefined(record[u])){
					return null;
				}
			});
			return record;
		};

		self.insert = function(record){
			// import
			if(angular.isArray(record) && record.length){
				console.log(record);
				record.forEach(function(rec, index){
					record[index] = undefineds(rec);
					if(!record[index]){
						delete record[index];
					}
				});

				self.db.insert(record);
			}
			else if(angular.isObject(record)){
				self.db.insert(record);
			}
		};

		self.update = function(record, callback){
			console.log('update', record, callback);

			if(angular.isFunction(callback)){
				// "record" is the query now
				self.db(record).update(callback);
			}else{
				self.db(record.___id).update(record);
			}
		};

		self.setFamilies = function(record, families){
			if(angular.isArray(families)){

				// remove all the things
				self.db({teacher:record.___id}).update({teacher:''});

				// add all the things
				families.forEach(function(family){
					self.db({___id:family}).update({teacher: record.___id});
				});
			}

		};

		self.setCompanions = function(record, companions){
			if(angular.isArray(companions)){

				// remove all the things
				self.db({senior:record.___id}).update({senior:''});

				// add all the things
				companions.forEach(function(companion){
					self.db({___id:companion}).update({senior: record.___id});
				});
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

		self.get = function(id){

			// search
			if(angular.isObject(id)){
				var deferred = $q.defer();
				deferred.resolve(self.db(id).get());
				return deferred.promise;
			}
			// single id
			else if(id){
				return self.db(id).first();
			}
			// initial request on app load
			else{
				var deferred = $q.defer();
				var get = self.db().get();

				// see if we have records in the localStorage
				if(!get.length){
					self.db.store().then(function(get){
						deferred.resolve(get);
					});
				}else{
					deferred.resolve(get);
				}

				return deferred.promise;
			}
		};

		// relations
		self.getFamilies = function(record,select){
			var id = record.___id,
			families = [];
			// if this memeber is not a senior companion see if he has a senior
			// and set the senior as the
			if(!record.is_senior && record.senior !== ''){
				id = record.senior;
			}

			if(select){
				return self.db({teacher:id}).select(select);
			}else{
				families = self.db({teacher:id}).get();
			}

			return families;
		};

		self.getCompanions = function(record,select){

			var companions = [],
			query = {senior:record};

			if(angular.isObject(record)){
				query.senior = record.___id;

				// if this memeber is not a senior companion see if he has a senior
				// and set the senior as the
				if(!record.is_senior && record.senior !== ''){
					query = [
						{
							senior: record.senior, // include companion of the senior
							___id:{'!is' : record.___id} // but dont include the current record
						},
						{___id: record.senior} // also include the senior record itself
					];
				}
			}

			if(select){
				return self.db(query).select(select);
			}else{
				companions = self.db(query).get();
			}

			return companions;
		};

		self.getTeachers = function(record){
			var teachers = []
			if(record.teacher !== ''){
				self.getCompanions(record.teacher).forEach(function(teacher){
					teachers.push(teacher);
				});

				teachers.push(self.db(record.teacher).first());
			}

			return teachers;
		};
	};

	return new members();
}]);