'use strict';

angular.module('waffellocatorApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'yqlAPIservice', 'geocoder',
  	function ($rootScope, $scope, yqlAPIservice, geocoder) {
	    $scope.places = [];
	    $scope.placeMarkers = []; // markers are in a random order
	    $scope.infoWindow = null;

	    $rootScope.$on('wdDataParsed', function(event, data) {
	    	console.log("received event with data,", data);
	    	$scope.places = data.places;

	    	data.places.forEach(function(place, index) {
	    		var address = place.address;
	    		var promise = geocoder.geocodeAddress(address);
	   
	    		promise.then(function(result) {
	    			var markerModel = {
	    				latitude: result.lat,
	    				longitude: result.lng,
	    				formattedAddress: result.formattedAddress,
	    				id: index
	    			};

	    			//console.log('Success: ', address, result, index);
	    			$scope.placeMarkers.push(markerModel);
	    		}, function(error) {
	    			var markerModel = {
	    				latitude: '',
	    				longitude: '',
	    				formattedAddress: '',
	    				id: index
	    			};
	    			//console.log('Failed: ', address, error, index);
	    		});
	    	});

	    });

	    $scope.getPlaces = function() {
    		yqlAPIservice.getAllLocations();
	    };

			$scope.map = {
			    center: {
			        latitude: 40.69847032728747,
			        longitude: -73.9514422416687
			    },
			    zoom: 12
			};


			$scope.panPlace = function(markerIndex) {
				for (var i = 0; i < $scope.placeMarkers.length; i++) {
					if ($scope.placeMarkers[i].id === markerIndex) {
						$scope.infoWindow = $scope.placeMarkers[i];
						break;
					}
				}

				console.log("Infowindow:", $scope.infoWindow);
			};

  	}]);
