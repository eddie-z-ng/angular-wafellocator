'use strict';

angular.module('waffellocatorApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'yqlAPIservice', 'geocoder', 'geolocator', 'distanceMatrix',
  	function ($rootScope, $scope, yqlAPIservice, geocoder, geolocator, distanceMatrix) {
	    $scope.places = [];
			$scope.map = {
		    center: {
		        latitude: 40.69847032728747,
		        longitude: -73.9514422416687
		    },
		    zoom: 13
			};

	    $scope.getCurrentLocation = function() {
	    	console.log($scope.map);
	    	geolocator.geolocate(5000).then(function(position) {
	    		$scope.startAddress = position.lat + ',' + position.lng;
	    	}, function(error) {
	    		console.log('Failed to get current location: ', error);
	    	});
	    };

	    $rootScope.$on('wdDataParsed', function(event, data) {
	    	console.log('Received wdDataParsed event with data: ', data);
	    	$scope.places = [];
	    	$scope.displayedDate = data.dateSelected;

	    	data.places.forEach(function(place, index) {
	    		var address = place.address;
	    		var promise = geocoder.geocodeAddress(address);
	   
	    		promise.then(function(result) {
	    			var markerModel = {
	    				latitude: result.lat,
	    				longitude: result.lng,
	    				formattedAddress: result.formattedAddress,
	    				id: index,
	    				//place: data.places[index],
	    				place: place, 
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
	    				$scope.map.refresh({latitude: markerModel.latitude, longitude: markerModel.longitude});
	    		// 		$scope.map.center.latitude = markerModel.latitude;
							// $scope.map.center.longitude = markerModel.longitude;
	    				markerModel.showWindow = true;
	    				$scope.$apply();
	    			};

	    			markerModel.closeClick = function() {
    					markerModel.showWindow = false;
    					$scope.$apply();
	    			};

	    			$scope.places[index] = markerModel;

	    		}, function(error) {
	    			//console.log('Failed: ', address, error, index);
	    		});
	    	});

	    });

	    $scope.getAllPlaces = function() {
    		yqlAPIservice.getAllLocations();
	    };

	    $scope.getSelectedPlaces = function(dateSelected, timeSelected) {
		  	var datems = Date.parse(dateSelected);
		  	
		  	if(!isNaN(datems)) {
			  	var date = new Date(datems);
			  	var dateString = (date.getMonth()+1) + '/' + 
			  										date.getDate() + '/' + 
			  										date.getFullYear();

			  	$scope.dateSelected = dateString;
    			yqlAPIservice.getPostLocations(dateString, timeSelected);
		  	} else {
		  		console.log('error');
		  	}
		  };

			$scope.panPlace = function(place) {
				// $scope.map.center.latitude = place.latitude;
				// $scope.map.center.longitude = place.longitude;
				$scope.map.refresh({latitude: place.latitude, longitude: place.longitude});
				$scope.map.zoom = 17;
				place.showWindow = true;
			};

			$scope.markerExists = function(index) {
				return (typeof $scope.places[index] !== 'undefined');
			};

			$scope.selectPlace = function(index) {
				$scope.selectedIndex = index;
			};

			$scope.getDistanceMatrix = function() {
				var origins = ['160 Pearl Street, New York, NY'];
				var destinations = $scope.places.map(function(elem) {
					return elem.place.address;
				});
				var travelMode = google.maps.TravelMode.DRIVING;

				if ($scope.startAddress) {
					origins[0] = $scope.startAddress;
				}

				var promise = distanceMatrix.getDistanceMatrix(origins, destinations, travelMode);
				promise.then(function(data) {
					console.log('Received distanceMatrix: ', data);

					$scope.startAddress = data.originAddresses[0];

					var matrix = data.rows[0].elements;
					matrix.forEach(function(elem, index) {
						if (elem.status == 'OK') {
							$scope.places[index].distance = elem.distance.text;
							$scope.places[index].duration = elem.duration.text;
						}
					});
				}, function(status) {
					console.log('Failed to get distanceMatrix: ', status);
				});

			};

			/* Truck Input Finder */

			$scope.times = [
				{ value: 'Morning' },
				{ value: 'Evening' }
			];
			$scope.timeSelected = $scope.times[0];

		  $scope.today = function() {
		    var date = new Date();
		    var dateString = (date.getMonth()+1) + '/' + 
			  								  date.getDate() + '/' + 
			  									date.getFullYear();
			  $scope.displayedDate = dateString;
			  $scope.dateSelected = dateString; 
		  };
		  $scope.today();

		  $scope.open = function($event) {
		  	console.log('clicked', $event);
		    $event.preventDefault();
		    $event.stopPropagation();

		    $scope.opened = true;
		  };

  	}]);
