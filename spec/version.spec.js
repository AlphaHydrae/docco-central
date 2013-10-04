
describe("Version", function() {

  var dc = require('../lib'),
      pkg = require('../package');

  it("should be correct", function() {
    expect(dc.version).toBe(pkg.version);
  });
});
