'use strict';

angular.module('waffellocatorApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'yqlAPIservice', 'geocoder', 'distanceMatrix',
  	function ($rootScope, $scope, yqlAPIservice, geocoder, distanceMatrix) {
	    $scope.places = [];
	    $scope.placeMarkers = []; // markers are in a random order

	    $rootScope.$on('wdDataParsed', function(event, data) {
	    	console.log("received event with data,", data);
	    	$scope.places = data.places;

	    	data.places.forEach(function(place, index, arr) {
	    		// arr[index].showWindow = false;
	    		var address = place.address;
	    		var promise = geocoder.geocodeAddress(address);
	   
	    		promise.then(function(result) {
	    			var markerModel = {
	    				latitude: result.lat,
	    				longitude: result.lng,
	    				formattedAddress: result.formattedAddress,
	    				id: index,
	    				place: data.places[index],
	    				showWindow: false,
	    				// options passed to Google InfoWindow
	    				markerOptions: {
          			// boxClass: 'custom-info-window',
          			// disableAutoPan: true
          			opacity: 0.8
        			},
        			windowOptions: {
        				pixelOffset: new google.maps.Size(0, 5),
        				disableAutoPan: true,
        				boxClass: 'custom-info-window'
        			}
	    			};

	    			markerModel.click = function() {
	    				console.log("OPENED", markerModel);
	    				$scope.map.center.latitude = markerModel.latitude;
							$scope.map.center.longitude = markerModel.longitude;
							// $scope.map.zoom = 17;
	    				markerModel.showWindow = true;
	    				$scope.$apply();
	    			};

	    			markerModel.closeClick = function() {
    					console.log("CLOSED");
    					markerModel.showWindow = false;
    					$scope.$apply();
	    			};

	    			//console.log('Success: ', address, result, index);
	    			$scope.placeMarkers.push(markerModel);
	    		}, function(error) {
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
			    zoom: 13
			};

			$scope.panPlace = function(index) {
				for (var i = 0; i < $scope.placeMarkers.length; i++) {
					if ($scope.placeMarkers[i].id === index) {
						//$scope.placeMarkers[i].click();
						$scope.map.center.latitude = $scope.placeMarkers[i].latitude;
						$scope.map.center.longitude = $scope.placeMarkers[i].longitude;
						$scope.map.zoom = 17;
						$scope.placeMarkers[i].showWindow = true;
					}
				}
			};

			$scope.markerExists = function(index) {
				return $scope.placeMarkers.some(function(elem) {
					return (elem.id === index);
				});
			};

			$scope.selectPlace = function(index) {
				$scope.selectedIndex = index;
			};

			$scope.getDistanceMatrix = function() {
				var origins = ["160 Pearl Street, New York, NY"];
				var destinations = $scope.places.map(function(elem) {
					return elem.address;
				});
				var travelMode = google.maps.TravelMode.DRIVING;

				var promise = distanceMatrix.getDistanceMatrix(origins, destinations, travelMode);
				promise.then(function(data) {
					console.log("Received distanceMatrix:", data);
					var matrix = data.rows[0].elements;
					matrix.forEach(function(elem, index) {
						if (elem.status == "OK") {
							$scope.places[index].distance = elem.distance.text;
							$scope.places[index].duration = elem.duration.text;
						}
					});
				}, function(status) {
					console.log("Failed to distanceMatrix:", status);
				});

			};

  	}]);
