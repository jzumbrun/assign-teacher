'use strict';

app.factory('Member', ['$taffy', function($taffy){

	var members = function(){
		var self = this;
		self.db = $taffy.getDB();

		self.schema = {
			city: {default:''},
			email: {default:''},
			household: {default:''},
			latitude: {default:''},
			location_status: {default: false},
			longitude: {default:''},
			phone: {default:''},
			state: {default:''},
			street: {default:''},
			zip: {default:''}
			
		};

		self.import = function(members){
			if(members.length){
				members.forEach(function(member, index){
					member = jQuery.extend(self.schema, member);
					self.db.insert(member);
				});
			}
		};

		self.get = function(){
			return self.db().get();
		};
	};

	return new members();
}]);