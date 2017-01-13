Neato.Services.findMe_basic1 = {
  findMe: function() {
    var message = { reqId: "1", cmd: "findMe" };
    return this.__call(message);
  }
}
