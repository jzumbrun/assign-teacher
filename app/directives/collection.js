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

app.directive('dirMasterActions',['$timeout', function($timeout) {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			$timeout(function(){

				var defaults = {'if': 'true', icon: 'ok', type: 'success', classes: ''};

				element.attr('id', 'master-actions');

				scope.master_actions = [];
				// reverse the array cause we pull right with css
				scope.master_actions = scope.$eval(attrs.dirMasterActions).reverse();
				scope.master_actions.forEach(function(action, index){
					scope.master_actions[index] = jQuery.extend({}, defaults, action);
				});
			});
			

		},
		template:
				'<button ng-repeat="action in master_actions" ng-if="$eval(action.if)" ng-click="$eval(action.click)" type="button" class="btn pull-right btn-{{action.type}} {{action.classes}}">' +
					'<span class="glyphicon glyphicon-{{action.icon}}"></span>' +
				'</button>'
			
	};
}]);

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
				imports[attrs.dirImport](e.dataTransfer)
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

app.directive('dirBack', ['$history', function($history) {
	return {
		// Restrict it to be an attribute in this case
		restrict: 'A',
		// responsible for registering DOM listeners as well as updating the DOM
		link: function(scope, element, attrs) {

			element.attr('id', 'back');
			element.addClass('btn pull-left text-white');
			element.prepend('<span class="glyphicon glyphicon-chevron-left text-white"></span>');
			element.on('click', function() {
				scope.$apply(function() {
					$history.back();
				});
			});
		}
	};
}]);


app.directive('dirBlock', function () {
	return {
		restrict:"EAC",
		link:function (scope, elm, attrs) {

			var self = {};

			self.value = attrs.blockValue || [];
			self.selected = attrs.blockSelected || [];
			self.name = attrs.blockName || '';
			self.size = attrs.blockSize || 40;
			self.cssClass = attrs.blockCssClass || 'block-icon';

			// check the state of the
			self.getState = function(){

				if(scope.selected.indexOf(self.value) > -1){
					self.select();
				}else{
					self.identifier();
				}
			};

			// check the state of the
			self.setState = function(){
				elm.html('');
				if(!angular.isArray(scope.selected)){ return;}

				if(scope.selected.exists(self.value)){
					scope.selected = scope.selected.remove(self.value);
					self.identifier();
				}else{
					scope.selected.push(self.value);
					self.select();
				}
			};

			self.identifier = function(){
				var tag = '<span class="glyphicon glyphicon-user" style="width: ' + self.size + 'px;font-size:' + (self.size * 0.6) + 'px" >';
				if(self.name){
					var first = self.name.charAt(0).toUpperCase();
					var color_map = {A:'primary', B:'success', C:'info', D:'warning', E:'danger', F:'yellow', G:'purple', H:'lt-blue', I:'lt-red',
									J:'primary', K:'success', L:'info', M:'warning', N:'danger', O:'yellow', P:'purple', Q:'lt-blue', R:'lt-red',
									S:'primary', T:'success', U:'info', V:'warning', W:'danger', X:'yellow', Y:'purple', Z:'lt-blue'};

					tag = '<span class="btn btn-' + color_map[first] + '" style="width: ' + self.size + 'px;font-size:' + (self.size * 0.6) + 'px" >' + first + '</span>';
				}
				//remove any existing glyphicon users 
				elm.find('span').remove();
				// insert the tag into the element
				elm.append(tag);
			};

			self.select = function(){
				var tag = '<span class="btn btn-grey glyphicon glyphicon-ok" style="padding-top: 20px;height: ' + self.size + 'px;width: ' + self.size + 'px;font-size:' + (self.size * 0.4) + 'px" >';
				//remove any existing glyphicon users 
				elm.find('span').remove();
				// insert the tag into the element
				elm.append(tag);
			};

			// check for selected stuffs
			if(self.selected && angular.isArray(scope.selected)){
				elm.on('click', function(event){
					self.setState();
				});

				self.getState();
			}else{
				self.identifier();
			}
		}
	};
});