'use strict';

angular.module('waffellocatorApp.factories')
  .factory('parseWDJSON', function () {
    var parseWDJSON = function(jsonData) {
      var waffleFuncs;
      var splittedIndex;
      var splitString;
      var splitArgs;
      var splittedFuncs;
      var regTrim;
      var regBr;
      var allPlacesArray = [];
      var testName;
      var testAddress;
      var testDayHours;
      var spec;

      waffleFuncs = jsonData.FUNCS;

      splittedFuncs = waffleFuncs.split('showAddress');

      // Regular expression to trim " '" at start of each entry in splittedFuncs
      regTrim = /^\s+'|\s+$/g;

      // Regular expression to cut off from '<br>' and onward in the testDayHours entry in splittedFuncs
      regBr = /<br>.+/;

      for (splittedIndex = 1; splittedIndex < splittedFuncs.length; splittedIndex++) {
        splitString = splittedFuncs[splittedIndex];
        splitArgs = splitString.split("',");

        testName = splitArgs[2].replace(regTrim, '').replace('\\', '');
        testAddress = splitArgs[1].replace(regTrim, '').replace('\\', '');
        // Set any address that doesn't start with a letter or number to empty
        if (testAddress.match(/^[^A-Za-z0-9]/)) {
          testAddress = '';
        }
        testDayHours = splitArgs[3].replace(regTrim, '').replace(regBr, '');

        spec = {
          name: testName,
          address: testAddress,
          hours: testDayHours
        };

        // Add to allPlaces if valid
        if (spec.name && spec.address && spec.hours) {
          allPlacesArray.push(spec);
        }
      }
      return allPlacesArray;
    };

    return parseWDJSON;
  });
