Neato.Robot.extend({
  generalInfo: function() {
    var message = { reqId: "1", cmd: "getGeneralInfo" };
    return this.__call(message);
  }
});
