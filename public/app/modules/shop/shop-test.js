(function () {
	'use strict';

	/**
	 * @ngdoc function
	 * @name app.test:shopTest
	 * @description
	 * # shopTest
	 * Test of the app
	 */

	describe('shop test', function () {
		var controller = null, $scope = null;

		beforeEach(function () {
			module('toDoProject');
		});

		beforeEach(inject(function ($controller, $rootScope) {
			$scope = $rootScope.$new();
			controller = $controller('ShopCtrl', {
				$scope: $scope
			});
		}));

		it('Should controller must be defined', function () {
			expect(controller).toBeDefined();
		});

	});
})();
