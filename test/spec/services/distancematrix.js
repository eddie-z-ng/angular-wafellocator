'use strict';

describe('Service: distanceMatrix', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var distanceMatrix;
  beforeEach(inject(function (_distanceMatrix_) {
    distanceMatrix = _distanceMatrix_;
  }));

  it('should do something', function () {
    expect(!!distanceMatrix).toBe(true);
  });

});
