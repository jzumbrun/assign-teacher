'use strict';

app.factory('Member', ['$taffy', '$q', 'geolib', 'Visit',
	function($taffy, $q, geolib, Visit){

	var members = function(){
		var self = this;
		self.db = $taffy.db();

		self.undefineds = ['household'];
		
		self.db.settings({
			name:'members',
			allowNull : false,
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
				note: '',
				tags: ''
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

		self.get = function(query,record){
			var deferred, get;
			// single id
			if(angular.isString(query)){
				return self.db(query).first();
			}
			else{
				deferred = $q.defer();
				// assignments
				if(angular.isObject(record) && record.___id){

					// query on assignments
					if(angular.isObject(query)){
						// dont include the current record
						query = jQuery.extend({}, {___id:{'!is' : record.___id}}, query);
					}
					console.log('im in');
					get = self.db(query).each(function(rec){
						// defult get distance between members
						if(!isNaN(parseInt(rec.latitude, 10)) && !isNaN(parseInt(rec.longitude, 10))){
							var distance = geolib.getDistance(
								{latitude: record.latitude, longitude: record.longitude},
								{latitude: rec.latitude, longitude: rec.longitude}
							);
							rec.distance = geolib.convertUnit('mi', rec.distance, 1);
						}

						if(!rec.distance && rec.distance !== 0){
							// one million -- means unset
							rec.distance = 1000000;
						}

					}).order('distance asec').get();

				}
				// just a query
				else if(angular.isObject(query)){
					console.log('im in1',query);

					get = self.db(query).order('household asec').get();
				}
				// all records
				else{
					console.log('im in2');
					get = self.db().order('household asec').get();
				}

				// see if we have records in the localStorage
				if(!query && !get.length){
					console.log('im in3');
					self.db.store().then(function(db){
						deferred.resolve(db().order('household asec').get());
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

		self.getVisits = function(record){
			var visits = [],
			deferred = $q.defer();

			Visit.get({member_id: record.___id}).then(function(visits){
				deferred.resolve(visits);
			});

			return deferred.promise;
		};

		self.getTags = function(query){

			// default tags
			var all_tags = ['elder', 'sister', 'focus', 'less-active'],
			tags = [],
			deferred = $q.defer();

			// get all tags from the db
			self.db().select('tags').forEach(function(record_tags){
				if(record_tags.length){
					record_tags.forEach(function(record_tag){
						if(record_tag.text){
							all_tags.push(record_tag.text);
						}
					});
				}
				
			});

			// unique them
			tags = jQuery.grep(tags, function(v, k){
				return jQuery.inArray(v ,tags) === k;
			});

			// query them
			all_tags.forEach(function(tag){
				if(tag.indexOf(query) > -1){
					tags.push(tag);
				}
			});

			deferred.resolve(tags);
			return deferred.promise;
		};
	};

	return new members();
}]);