'use strict';

// angular access to nodejs model
if(typeof angular != 'undefined'){
	app.factory('Member', ['$sequelize', function($sequelize){
		return $sequelize.getModel('Member');
	}]);
}
// nodejs model
else{
	module.exports = function(sequelize, DataTypes) {
		var Member = sequelize.define('Member', {
			id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
			household: DataTypes.STRING(256),
			first_name: DataTypes.STRING(128),
			last_name: DataTypes.STRING(128),
			longitude: DataTypes.FLOAT(3,10),
			latitude: DataTypes.FLOAT(3,10),
			street: DataTypes.STRING(60),
			city: DataTypes.STRING(60),
			state: DataTypes.STRING(60),
			zip: DataTypes.STRING(30),
			phone: DataTypes.STRING(20),
			email: DataTypes.STRING(256),
			location_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
			hidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
			senior: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
			note: DataTypes.TEXT

		},{
			tableName: 'members',
			underscored: true,
			timestamps: true,
			freezeTableName: true,
			classMethods: {
				associate: function(models) {
					var self = this;
					self.hasMany(self,{as: 'Families', through: 'assignments'})
						.hasMany(self,{as: 'Teachers', foreignKey: 'families_id', through: 'assignments'})
						.hasMany(self,{as: 'Companions', through: 'companions'})
						.hasMany(models.Visit);
				},
				table: function(options){
					var self = this,
					find_options = {hidden: false};

					self.parseSearch = function(find_options){
						
						var default_field = 'household',
						fields = Object.keys(self.rawAttributes),
						values = [],
						conditions = ['=', '>','<', '!=', '-'];

						if(!options.search){
							return find_options;
						}

						// get operators
						var search_operators = options.search.match(/\S[^: ]*:/g);
						
						// set default operator
						if(!search_operators){
							search_operators = [default_field + ':'];
						}

						// get values
						options.search.split(/\S*:/).forEach(function(value){
							if(value !== ''){
								value = value.trim();
								if(value == '-'){ value = false; } // - means empty or false
								values.push(value);
							}
						});

						search_operators.forEach(function(field, index){
	
							field = field.toLowerCase().substring(0, field.length -1); // lowercase and remove the :

							var condition = 'LIKE';
							if(field.charAt(0).match(/[^a-z]/)){
								condition = field.charAt(0);
								field = field.substring(1); // remove the condition
							}

							// set fields
							if(fields.indexOf(field) > -1) {
								if(!find_options.where){ find_options.where = ''; }

								if(condition == '-'){ condition = '!='; }

								if(conditions.indexOf(condition) > -1){
									find_options.where += field + " " + condition + " '" + values[index] + "'";
								}
								else if(!values[index]){
									find_options.where += field + " = '' OR "+ field +" IS NULL OR "+ field +" = 0";
								}
								else{
									find_options.where += field + " LIKE '%" + values[index] + "%'";
								}

								find_options.where += ' AND ';

							}
							// order
							else if(field == 'order'){
								if(condition == '-'){
									find_options.order = values[index] + ' DESC';
								}
								else{
									find_options.order = values[index];
								}
								
							}
						});
						
						// remove the and
						if(find_options.where && find_options.where.substring(find_options.where.length - 4) == 'AND '){
							find_options.where = find_options.where.substring(0, find_options.where.length - 5);
						}

						return find_options;
					};

					find_options = self.parseSearch(find_options);

					console.log(find_options);

					return self.findAll(find_options);
					
				}
			}
		});

		return Member;
	};
}