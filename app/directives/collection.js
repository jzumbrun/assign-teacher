app.directive('ngMethod', ['$route', function($route) {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			// Call method without params. Use $routeParams
			if(angular.isFunction(scope[attrs.ngMethod])){
				scope[attrs.ngMethod]();
			// default to the route method if attrs.ngMethod is empty
			} else if(angular.isObject($route.current) 
				&& angular.isString($route.current['method']) 
				&& angular.isFunction(scope[$route.current['method']])){
				scope[$route.current['method']]();
			}
		}
	};
}]);

app.directive('dirButton', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			var defaults = {'classes': 'pull-right', type: 'success'};
			var obj = jQuery.extend({}, defaults, scope.$eval(attrs.dirButton));

			element.addClass('btn btn-' + obj.type + ' ' + obj.classes);
			element.append('<span class="glyphicon glyphicon-' + obj.icon + '">');
		}
	};
});

app.directive('dirImport', ['imports', function(imports) {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			element = element[0]; // needs to be the native element
			window.ondragover = function(e) { e.preventDefault(); return false; };
			window.ondrop = function(e) { e.preventDefault(); return false; };
			element.ondragover = function () { this.className = 'hover'; return false; };
			element.ondragend = function () { this.className = ''; return false; };
			element.ondrop = function (e) {
				e.preventDefault();
				imports[attrs.dirImport](e.dataTransfer.files[0].path)
				.then(function(data){
					scope.import = data;
					scope.save();

				});
			};
		}
	};
}]);

app.directive('dirSearch', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			var defaults = {placeholder : 'see help for search operators'};
			var obj = jQuery.extend({}, defaults, scope.$eval(attrs.dirSearch));

			element.addClass('form-group');
			var input = jQuery('<input type="text" id="search" placeholder="' + obj.placeholder + '">');
			input.on('keyup', function(event){
				if ( event.which == 13 ) { // only on enter
					scope.table({search: $(this).val()});
				}
			});

			var help = jQuery('<div dir-button="{icon: \'plus-sign\'}"></div>');
			element.append(input);
			element.append(help);
		}
	};
});

app.directive('dirBack', ['$window', function($window) {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			element.attr('id', 'back');
			element.addClass('btn pull-left text-white');
			element.prepend('<span class="glyphicon glyphicon-chevron-left text-white"></span>');
			element.on('click', function() {
				$window.history.back();
			});
		}
	};
}]);

app.directive('dirMasterActions', function() {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {
			var defaults = {'if': 'true', icon: 'ok', type: 'success'};

			element.attr('id', 'master-actions');

			scope.master_actions = [];
			// reverse the array cause we pull right with css
			scope.master_actions = scope.$eval(attrs.dirMasterActions).reverse();
			scope.master_actions.forEach(function(action, index){
				scope.master_actions[index] = jQuery.extend({}, defaults, action);
			});

		},
		template:
				'<button ng-repeat="action in master_actions" ng-if="$eval(action.if)" ng-click="$eval(action.click)" type="button" class="btn pull-right btn-{{action.type}}">' +
					'<span class="glyphicon glyphicon-{{action.icon}}"></span>' +
				'</button>'
			
	};
});

/*
 * An Simple AngularJS Gravatar Directive
 *
 * Written by Jim Lavin
 * http://codingsmackdown.tv
 *
 */

angular.module('ui-gravatar', ['md5']).
	factory('gravatarImageService', function (md5) {
		return {
			getImageSrc : function(value, size, rating, defaultUrl, secure) {
				// convert the value to lower case and then to a md5 hash
				var hash = md5.createHash(value.toLowerCase());
				var src = (secure ? 'https://secure' : 'http://www' ) + '.gravatar.com/avatar/' + hash + '?s=' + size + '&r=' + rating + '&d=' + defaultUrl;
				return src;
			}
		};
	}).
	directive('gravatarImage', ['gravatarImageService', function (gravatarImageService) {
		return {
			restrict:"EAC",
			link:function (scope, elm, attrs) {

				var self = {};

				self.email = attrs.gravatarEmail || '';
				self.object = attrs.gravatarObject || false;
				self.selected = attrs.gravatarSelected || 'selected';
				self.name = attrs.gravatarName || '';
				self.size = attrs.gravatarSize || 40;
				self.rating = attrs.gravatarRating || 'pg';
				self.defaultUrl = attrs.gravatarDefault || '404';
				self.cssClass = attrs.gravatarCssClass || 'gravatar-icon';

				// check the state of the
				self.getState = function(){
					if(scope[self.object][self.selected]){
						self.select();
					}else{
						self.identifier();
					}
				};

				// check the state of the
				self.setState = function(){

					console.log(self);
					console.log(scope);
					elm.html('');
					if(scope[self.object][self.selected]){
						scope[self.object][self.selected] = false;
						self.identifier();
					}else{
						scope[self.object][self.selected] = true;
						self.select();
					}
				};

				self.identifier = function(){
					// let's do nothing if the email comes in empty, null or undefined
					if ((self.email !== null) && (self.email !== undefined) && (self.email !== '') && (null !== self.email.match(/.*@.*\..{2}/))) {

						// get image src from service
						var src = gravatarImageService.getImageSrc(self.email, self.size, self.rating, self.defaultUrl, attrs.gravatarSecure);
						// construct the tag to insert into the element
						var tag = '<img class="' + self.cssClass + '" src="' + src + '" >';
						// remove any existing imgs 
						elm.find('img').remove();
						// insert the tag into the element
						elm.append(tag);

					}
					else{
						var tag = '<span class="glyphicon glyphicon-user" style="width: ' + self.size + 'px;font-size:' + (self.size * .6) + 'px" >';
						if(self.name){
							var first = self.name.charAt(0).toUpperCase();
							var color_map = {A:'primary', B:'success', C:'info', D:'warning', E:'danger', F:'yellow', G:'purple', H:'lt-blue', I:'lt-red',
											J:'primary', K:'success', L:'info', M:'warning', N:'danger', O:'yellow', P:'purple', Q:'lt-blue', R:'lt-red',
											S:'primary', T:'success', U:'info', V:'warning', W:'danger', X:'yellow', Y:'purple', Z:'lt-blue'};

							tag = '<span class="btn btn-' + color_map[first] + '" style="width: ' + self.size + 'px;font-size:' + (self.size * .6) + 'px" >' + first + '</span>';
						}
						//remove any existing glyphicon users 
						elm.find('span').remove();
						// insert the tag into the element
						elm.append(tag);

					}
				};

				self.select = function(){
					var tag = '<span class="btn btn-grey glyphicon glyphicon-ok" style="padding-top: 20px;height: ' + self.size + 'px;width: ' + self.size + 'px;font-size:' + (self.size * .4) + 'px" >';
					//remove any existing glyphicon users 
					elm.find('span').remove();
					// insert the tag into the element
					elm.append(tag);
				};

				// check for selected stuffs
				if(self.selected){
					elm.on('click', function(event){
						self.setState();
					});

					self.getState();
				}else{
					self.identifier();
				}
				
			}};
	}]);