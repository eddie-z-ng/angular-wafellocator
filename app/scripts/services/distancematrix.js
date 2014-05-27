'use strict';

angular.module('waffellocatorApp.factories')
  .factory('distanceMatrix', ['$q', function ($q) {

    var distanceMatrixService = new google.maps.DistanceMatrixService();
    // var distanceMatrixAPI = {};

    // distanceMatrixAPI = {
    //   getDistanceMatrix: function(origins, destinations, travelMode) {
    //     var opts = {
    //       origins: origins,
    //       destinations: destinations,
    //       travelMode: travelMode,
    //       unitSystem: google.maps.UnitSystem.METRIC,
    //       durationInTraffic: true,
    //       avoidHighways: false,
    //       avoidTolls: false
    //     };

    //     distanceMatrixService.getMatrix(opts, function(data, status) {
    //       $rootScope.$emit('distanceMatrix', data, status);
    //     });

    //   }

    // };


    return {
      getDistanceMatrix : function (origins, destinations, travelMode) {
        var d = $q.defer();

        var opts = {
          origins: origins,
          destinations: destinations,
          travelMode: travelMode,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        };

        distanceMatrixService.getDistanceMatrix(opts, function(data, status) {
          if (status == google.maps.DistanceMatrixStatus.OK) {
            d.resolve(data);
          } else {
            d.reject('Error getting data matrix - Status:', status);
          }
        });

        return d.promise;
      }
    };

  }]);
