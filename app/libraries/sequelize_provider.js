
'use strict';

 /* global -sequelize */
angular.module('sequelize', []).
                        provider('$sequelize', $sequelizeProvider);

function $sequelizeProvider(){

    var self = this;

    self.getModel = function(name){
        if(!angular.isUndefined(self.models[name])){
            return self.models[name];
        }
        return null;
    };

    self.load = function() {

        var fs      = require('fs'),
        path      = require('path'),
        _    = require('lodash'),
        Sequelize = require('sequelize'),
        root      = process.cwd(),
        nwPath = process.execPath,
        nwDir = path.dirname(nwPath),
        models    = {};

        self.models    = {};
        var sequelize = new Sequelize('database', 'username', 'password', {
            dialect: 'sqlite',
            storage: nwDir + '/database.sqlite',
            define: {
              charset: 'utf8',
              collate: 'utf8_general_ci'
            }
    });

        fs.readdirSync('models')
        .filter(function(file) {
          return (file.indexOf('.') !== 0);
        })
        .forEach(function(file) {
          var model = sequelize.import(root + '/models/' + file);
          models[model.name] = model;
        });

        Object.keys(models).forEach(function(model_name) {
          if ('associate' in models[model_name]) {
            models[model_name].associate(models);
          }

          models[model_name].sync();

        });

        self.models = _.extend(
          {sequelize: sequelize,
            Sequelize: Sequelize},
            models);
    };

    self.$get = function() {
      return {
        load: function() {
          return self.load();
        },
        getModel: function(name){
          return self.getModel(name);
        }
      };
    };

}

