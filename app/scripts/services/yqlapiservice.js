'use strict';
/* 
 * Uses YQL to request Wafels and Dinges data
 * @author: Eddie Ng
 */

angular.module('waffellocatorApp.factories')
  .factory('yqlAPIservice', ['$rootScope', '$http', '$timeout', 'storage', 'parseWDJSON', 
  function ($rootScope, $http, $timeout, storage, parseWDJSON) {

    var yqlAPI = {};
    var dataKey = 'wafelPlaces';
    var dataEvent = 'wdDataParsed';

    var yqlURLizer = function (query) {
      if (!query) {
        throw new Error('YQL(): Parameters may be undefined');
      }

      var encodedQuery = encodeURIComponent(query.toLowerCase()),
          url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodedQuery + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK';

      return url;
    };

    var successFunc = function (data, type, dateSelected) {
      // Parse the returned data
      // console.log("Success-", data);
      if (data.query.count) {
        var jsonData;
        var save = true;

        if (typeof type !== undefined && type === 'post') {
          jsonData = data.query.results.postresult.json;
          save = false;
        } else {
          jsonData = data.query.results.json;
        }

        if (jsonData.MSG === 'OK') {
          var places = parseWDJSON(jsonData);
          saveAndEmitData(save, places, dateSelected);
        } else {
          console.log('Failed to get truck data');
        }
      } else {
        console.log('Failed to get truck data - YQL');
      }
    };

    var saveAndEmitData = function(save, places, dateSelected) {
      var currentTime = new Date();
      var data = { saveDate: currentTime.toDateString(),
                   saveHour: currentTime.getHours(),
                   dateSelected: dateSelected, 
                   places: places };

      // Save to localStorage
      if (save) {
        storage.set(dataKey, data);
      }

      // Emit data to listeners
      $rootScope.$emit(dataEvent, data);
    };

    var getLocations = function() {
      // GETs all current locations for today
      // NOTE: in order to specify date, kinds of locations, and time, must use the POST version
      var yqlQuery = 'select * from json where url=',
          baseURL = '"http://www.wafelsanddinges.com/trucks/searchtrucks.php"',
          fullURL = yqlQuery + baseURL,
          yqlURL;

      yqlURL = yqlURLizer(fullURL);

      //console.log('get: yqlURL is ', yqlURL);

      return $http({
        method: 'JSONP',
        url: yqlURL
      });
    };

    yqlAPI.getPostLocations = function(selDate, selTime) {
      //console.log("Doing an HTTP POST to get data for selected date, time, and location types");
      // selectedTruck -> 0 = all, 1 = trucks, 2 = carts, 3 = stores
      // selectedTime -> expect 0 for morning, 1 for evening ['5' = morning, '>5' = evening]
      // selectedDate -> date string
      var yqlQuery = 'select * from jsonpost where url=',
          baseURL = 'http://www.wafelsanddinges.com/trucks/searchtrucks.php',
          //selectedDate = "9/27/2013",
          //selectedTime = ">5",
          selectedDate = selDate.replace(/-/g, '/'),
          selectedTime = selTime === 'Morning' ? '5' : '>5',
          selectedTruck = 0,
          postData = "date=" + selectedDate + "&time=" + selectedTime + "&truck_id=" + selectedTruck,
          constructedURL = "'" + baseURL + "' and postdata='" + postData + "'",
          fullURL = yqlQuery + constructedURL,
          yqlURL;

      yqlURL = yqlURLizer(fullURL);
      console.log('POST: yqlURL is ', yqlURL);
      return $http({
        method: 'JSONP',
        url: yqlURL
      }).success(function(data) {
        successFunc(data, 'post', selDate);
      });
    };

    yqlAPI.getAllLocations = function() {
      var savedData = storage.get(dataKey);
      var currentTime = new Date();
      var dateString = (currentTime.getMonth()+1) + '/' + 
                        currentTime.getDate() + '/' + 
                        currentTime.getFullYear();

      if (savedData && 
          (savedData.saveDate === currentTime.toDateString() ||
           savedData.saveHour === currentTime.getHours()) ) {
        // Recent data exists in localStorage
        console.log('Loading data from localStorage: ', savedData);
        $timeout(function() { 
          saveAndEmitData(false, savedData.places, dateString);
        }, 1);
      } else {
        // Stale data, make a call to server
        console.log('Making a call to server for data');
        return getLocations().success(function(data) {
          successFunc(data, 'get', dateString);
        });
      }
    };

    yqlAPI.getAllLocations();

    return yqlAPI;
  }]);
