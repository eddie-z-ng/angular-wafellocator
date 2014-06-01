'use strict';

angular.module('waffellocatorApp')
  .controller('MainCtrl', ['$rootScope', '$scope', 'yqlAPIservice', 'geocoder', 'geolocator', 'distanceMatrix',
  	function ($rootScope, $scope, yqlAPIservice, geocoder, geolocator, distanceMatrix) {
	    var directionsService = new google.maps.DirectionsService();
	    var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
	    var defaultFromAddress = '160 Pearl Street, New York, NY';

	    $scope.places = [];
			$scope.map = {
		    center: {
		        latitude: 40.69847032728747,
		        longitude: -73.9514422416687
		    },
		    zoom: 13
			};

			/****************/
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
			  $scope.dateSelected = date; 
		  };
		  $scope.today();

		  $scope.open = function($event) {
		  	console.log('clicked', $event);
		    $event.preventDefault();
		    $event.stopPropagation();

		    $scope.opened = !$scope.opened;
		  };
			/****************/

	    $scope.getCurrentLocation = function() {
	    	geolocator.geolocate(5000).then(function(position) {
	    		$scope.startAddress = position.lat + ',' + position.lng;
	    		$scope.getDistanceMatrix();

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
	    				$scope.map.refresh({latitude: markerModel.latitude, 
	    					longitude: markerModel.longitude});
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
			  	
			  	// Clear out all places
			  	$scope.places = [];
    			
    			yqlAPIservice.getPostLocations(dateString, timeSelected);
		  	} else {
		  		console.log('error');
		  	}
		  };

			$scope.panPlace = function(place) {
				$scope.selectPlace(place);
				
				$scope.map.refresh({latitude: place.latitude, longitude: place.longitude});
				$scope.map.zoom = 17;
				place.showWindow = true;
			};

			$scope.markerExists = function(index) {
				return (typeof $scope.places[index] !== 'undefined');
			};

			$scope.selectPlace = function(place) {
				$scope.selectedPlace = place;
			};

			$scope.getDistanceMatrix = function() {
				// This is when a user resubmits a new address request so
				// need to reset relevant scope fields here

        $scope.directionsShow = false;
        $scope.selectedPlace = null;
        $scope.selectedTravelOption = null;
        $scope.awaitingDirections = false;

				$scope.startAddress = $scope.startAddress || defaultFromAddress;

				var origins = [$scope.startAddress];
				var destinations = $scope.places.map(function(elem) {
					return elem.place.address;
				});
				var travelMode = google.maps.TravelMode.DRIVING;

				var promise = distanceMatrix.getDistanceMatrix(origins, destinations, travelMode);
				promise.then(function(data) {
					console.log('Received distanceMatrix: ', data);

					$scope.startAddress = data.originAddresses[0];

					var matrix = data.rows[0].elements;
					matrix.forEach(function(elem, index) {
						if (elem.status == 'OK') {
							$scope.places[index].distanceText = elem.distance.text;
							$scope.places[index].distanceValue = elem.distance.value;
						}
					});
				}, function(status) {
					console.log('Failed to get distanceMatrix: ', status);
				});

			};

			/* Directions finding */

      $scope.travelOptions = ['driving', 'transit', 'bicycling', 'walking'];
      $scope.selectedTravelOption = 'driving';

			$scope.setDirections = function (place, travelOption) {
        $scope.directionsShow = false;
        $scope.awaitingDirections = true;

				$scope.selectPlace(place);

				directionsDisplay.setMap($scope.map.getGMap());
				directionsDisplay.setPanel(document.getElementById('directions'));

				$scope.startAddress = $scope.startAddress || defaultFromAddress;
				$scope.selectedTravelOption = travelOption;


        var selectedMode = travelOption.toUpperCase() || 'DRIVING',
            from = $scope.startAddress,
            request = {
                origin: from,
                destination: place.place.address,
                travelMode: selectedMode,
                provideRouteAlternatives: true,
                unitSystem: google.maps.UnitSystem.METRIC,
                optimizeWaypoints: true
            };
        if (selectedMode === 'TRANSIT') {
            request.transitOptions = {
              departureTime: new Date()
            };
        }

        directionsService.route(request, function (response, status) {
        	console.log("Directions: ", response, status);
          if (status === google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
              $scope.directionsShow = true;
              $scope.awaitingDirections = false;

          } else {
              // toastr.error(status);
              $scope.awaitingDirections = false;
              console.log(status);
          }
        });
			};

  	}]);
