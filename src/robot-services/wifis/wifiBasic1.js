Neato.Services.wifi_basic1 = {
  getWifiNetworks: function() {
    var message = { reqId: "1", cmd: "getWifiNetworks" };
    return this.__call(message);
  },
  setWifiNetwork: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "setWifiNetwork",
      params: {
        ssid: options.ssid || ""
      }
    };
    return this.__call(message);
  },
  addWifiNetwork: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "addWifiNetwork",
      params: {
        ssid: options.ssid || "",
        password: options.password || ""
      }
    };
    return this.__call(message);
  },
  removeWifiNetwork: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "removeWifiNetwork",
      params: {
        ssid: options.ssid || ""
      }
    };
    return this.__call(message);
  },
  getAvailableWifiNetworks: function() {
    var message = { reqId: "1", cmd: "getAvailableWifiNetworks" };
    return this.__call(message);
  },
  resetWifiNetworks: function() {
    var message = { reqId: "1", cmd: "resetWifiNetworks" };
    return this.__call(message);
  }
};
