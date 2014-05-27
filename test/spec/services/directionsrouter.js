'use strict';

describe('Service: directionsRouter', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var directionsRouter;
  beforeEach(inject(function (_directionsRouter_) {
    directionsRouter = _directionsRouter_;
  }));

  it('should do something', function () {
    expect(!!directionsRouter).toBe(true);
  });

});
