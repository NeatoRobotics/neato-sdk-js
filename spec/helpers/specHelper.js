beforeEach(function() {
  jasmine.Ajax.install();
});

afterEach(function() {
  jasmine.Ajax.uninstall();
});

function mostRecentAjaxRequest() {
  return jasmine.Ajax.requests.mostRecent();
}
