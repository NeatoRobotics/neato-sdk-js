Neato.User = function () {
  this.initialize.apply(this, arguments);
};
Neato.User.prototype = {

  initialize: function () {
    // init
    this.__parseRedirectURIResponse();
    this.host = "beehive.neatocloud.com";
    this.oauthHost = "apps.neatorobotics.com";
    this.robots = [];
  },

  getUserInfo: function () {
    return this.__call("GET", "/users/me");
  },

  getRobots: function () {
    var self = this;
    var deferredObject = $.Deferred();

    this.__call("GET", "/users/me/robots")
      .done(function (data) {
        self.robots = [];
        for (var i = 0; i < data.length; i++) {
          self.robots.push(new Neato.Robot(data[i].serial, data[i].secret_key,
            {
              name: data[i].name,
              model: data[i].model
            }));
        }
        deferredObject.resolve.call(self, self.robots);
      })
      .fail(function (data) {
        deferredObject.reject.call(self, data);
      });
    return deferredObject;
  },

  getRobotBySerial: function(serial) {
    for(var i=0; i<this.robots.length; i++) {
      if(this.robots[i].serial.localeCompare(serial) == 0 ) return this.robots[i];
    }
    return null;
  },

  // AUTH
  login: function (options) {
    options = options || {};
    var url = "https://" + this.oauthHost + "/oauth2/authorize?client_id=" + options["clientId"] +
      "&scope=" + options["scopes"] + "&response_type=token&redirect_uri=" + options["redirectUrl"];
    this.__navigateToURL(url);
  },
  logout: function() {
    var self = this;
    return this.__call("POST", "/oauth2/revoke",
      {
        token: self.token
      });
  },
  isConnected: function () {
    var self = this;
    var deferredObject = $.Deferred();

    this.__sessionsCheck()
      .done(function (data) {
        self.connected = true;
        deferredObject.resolve.call(self, true);
      })
      .fail(function (data) {
        self.connected = false;
        deferredObject.reject.call(self, false);
      });

    return deferredObject;
  },
  authenticationError: function () {
    return this.authError != undefined;
  },
  __sessionsCheck: function() {
    return this.__call("GET", "/users/me");
  },
  __navigateToURL: function(url) {
    location.replace(url);
  },
  __parseRedirectURIResponse: function () {
    var params = document.location.hash.replace("#", "").split("&");

    var self = this;

    params.forEach(function (item, index) {
      var key = item.split("=")[0] || "",
        value = item.split("=")[1] || "";

      if (key.localeCompare("access_token") == 0) {
        self.token = value;
      } else if (key.localeCompare("error") == 0) {
        self.authError = value;
      } else if (key.localeCompare("error_description") == 0) {
        self.authErrorDescription = value.replace(/\+/g, " ");
      }
    });
  },
  __call: function (method, path, message) {
    if (method.localeCompare("GET") == 0) message = message || null;
    else message = message || {};

    var self = this
      , deferredObject = $.Deferred()
      , url = "https://" + this.host + path
      , acceptHeader = "application/vnd.neato.beehive.v1+json"
      , date = new Date()
      , dateHeader = date.toUTCString()
      , messageStr = message==null?null:JSON.stringify(message)
      , authorizationHeader = "Bearer " + this.token;

    // ajax call
    var ajax = $.ajax({
      crossDomain: true,
      dataType: 'json',
      method: method,
      url: url,
      headers: {
        Accept: acceptHeader,
        Authorization: authorizationHeader,
        "X-Date": dateHeader,
        "Content-type": "application/json"
      },
      data: messageStr
    });

    ajax.done(function (data, textStatus, jqXHR) {
      deferredObject.resolve.call(self, jqXHR.responseJSON);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      deferredObject.reject.call(self, jqXHR.responseJSON);
    });

    return deferredObject;
  }
};
