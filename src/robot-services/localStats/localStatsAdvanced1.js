Neato.Services.localStats_advanced1 = {
  localStats: function() {
    var message = { reqId: "1", cmd: "getLocalStats" };
    return this.__call(message);
  }
}
