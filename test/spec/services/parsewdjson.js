'use strict';

describe('Service: parseWDJSON', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var parseWDJSON;
  beforeEach(inject(function (_parseWDJSON_) {
    parseWDJSON = _parseWDJSON_;
  }));

  it('should do something', function () {
    expect(!!parseWDJSON).toBe(true);
  });

});
