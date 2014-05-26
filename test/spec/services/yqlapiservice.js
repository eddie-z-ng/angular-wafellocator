'use strict';

describe('Service: yqlAPIservice', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var yqlAPIservice;
  beforeEach(inject(function (_yqlAPIservice_) {
    yqlAPIservice = _yqlAPIservice_;
  }));

  it('should do something', function () {
    expect(!!yqlAPIservice).toBe(true);
  });

});
