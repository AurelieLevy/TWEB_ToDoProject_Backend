'use strict';

/**
 * @ngdoc function
 * @name app.route:shopRoute
 * @description
 * # shopRoute
 * Route of the app
 */

angular.module('shop')
	.config(['$stateProvider', function ($stateProvider) {
		
		$stateProvider
			.state('home.shop', {
				url:'/shop',
				templateUrl: 'app/modules/shop/shop.html',
				controller: 'ShopCtrl',
				controllerAs: 'vm'
			});

		
	}]);
