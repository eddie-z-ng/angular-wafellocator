'use strict';

describe('Service: directionService', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var directionService;
  beforeEach(inject(function (_directionService_) {
    directionService = _directionService_;
  }));

  it('should do something', function () {
    expect(!!directionService).toBe(true);
  });

});
