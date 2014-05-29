'use strict';

// angular access to nodejs model
if(typeof angular != 'undefined'){
	app.factory('Visit', ['$sequelize', function($sequelize){
		return $sequelize.getModel('Visit');
	}]);
}
// nodejs model
else{
	module.exports = function(sequelize, DataTypes) {
		var Visit = sequelize.define('Visit', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			member_id : DataTypes.INTEGER(11),
			date: DataTypes.DATE,
			type: DataTypes.STRING(20),
			note: DataTypes.TEXT
		},{
			tableName: 'visits',
			underscored: true,
			freezeTableName: true
		});

		return Visit;
	};
}