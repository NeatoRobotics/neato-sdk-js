Neato.Robot = function() { this.initialize.apply(this, arguments); };
Neato.Robot.prototype = {

  initialize: function(serial, secretKey, options) {
    // init
    this.serial = serial;
    this.secretKey = secretKey;

    // options
    options = options || {};
    this.host = "nucleo.neatocloud.com";
    this.port = 4443;
    this.onConnected = options.onConnected;
    this.onDisconnected = options.onDisconnected;
    this.onStateChange = options.onStateChange;
  },

  connect: function() {
    var self = this;

    this.timer = setInterval(function() { self.getState.apply(self) }, 3000);
    this.getState();
  },

  disconnect: function() {
    // stop polling
    clearInterval(this.timer);
    delete this.timer;
    // trigger callback
    this.__disconnect();
  },

  getState: function() {
    var message = { reqId: "1", cmd: "getRobotState" };
    return this.__call(message);
  },

  getInfo: function() {
    var message = { reqId: "1", cmd: "getRobotInfo" };
    return this.__call(message);
  },

  __call: function(message) {
    var self = this
      , deferredObject = $.Deferred()
      , url = "https://" + this.host + ":" + this.port + "/vendors/neato/robots/" + this.serial + "/messages"
      , acceptHeader = "application/vnd.neato.nucleo.v1"
      , date = new Date()
      , dateHeader = date.toUTCString()
      , messageStr = JSON.stringify(message);

    // compute authorization header
    var stringToSign = this.serial.toLowerCase() + "\n" + dateHeader + "\n" + messageStr;
    var authorizationHeader = "NEATOAPP " + CryptoJS.HmacSHA256(stringToSign, this.secretKey);

    // ajax call
    $.ajax({
      crossDomain: true,
      dataType: 'json',
      method: 'POST',
      url: url,
      headers: {
        Accept: acceptHeader,
        Authorization: authorizationHeader,
        "X-Date": dateHeader
      },
      data: messageStr
    }).done(function(data, textStatus, jqXHR) {
      // get json response
      var json = jqXHR.responseJSON;
      // set state
      self.__setState(json);
      // trigger deferred
      var reply = self.__extractReplyFromReponse(json);
      if (reply.result == "ok") {
        deferredObject.resolve.call(self, reply.result, reply.data);
      } else {
        deferredObject.reject.call(self, reply.result, reply.data);
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      // trigger onDisconnected
      self.__disconnect(jqXHR.status, jqXHR.responseJSON);
    });

    return deferredObject;
  },

  __setState: function(json) {
    if (typeof(json.state) !== "undefined") {
      var newState = Neato.utils.clone(json, {
        except: ["version", "reqId", "result", "data"]
      });
      // compare states
      var gotOnline = typeof(this.state) === "undefined";
      var stateIsChanged = typeof(this.state) === "undefined" || !Neato.utils.haveEqualProps(this.state, newState);
      // save new state
      this.state = newState;
      // trigger callback
      if (gotOnline && this.onConnected) { this.onConnected(); }
      if (stateIsChanged && this.onStateChange) { this.onStateChange(); }
    }
  },

  __disconnect: function(status, jsonBody) {
    delete this.state;
    if (this.onDisconnected) { this.onDisconnected(status, jsonBody); }
  },

  __extractReplyFromReponse: function(json) {
    return Neato.utils.clone(json, {
      only: ["result", "data"]
    });
  }
};

// helper to extend prototype
Neato.Robot.extend = function(obj) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      Neato.Robot.prototype[i] = obj[i];
    }
  }
};
