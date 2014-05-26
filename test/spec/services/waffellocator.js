'use strict';

describe('Service: waffellocator', function () {

  // load the service's module
  beforeEach(module('waffellocatorApp'));

  // instantiate service
  var waffellocator;
  beforeEach(inject(function (_waffellocator_) {
    waffellocator = _waffellocator_;
  }));

  it('should do something', function () {
    expect(!!waffellocator).toBe(true);
  });

});
