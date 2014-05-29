'use strict';

app.factory('Member', function(){
	var db = TAFFY();
	db.store('assignteachers');
	return db;
});