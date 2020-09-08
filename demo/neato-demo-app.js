var NeatoDemoApp = {
  clientId: null,
  scopes: null,
  redirectUrl: null,
  user: null,

  initialize: function (options) {
    this.clientId = options.clientId;
    this.scopes = options.scopes;
    this.redirectUrl = options.redirectUrl;

    this.guiShowLoginPage();
    this.guiHideDashboardPage();
    this.guiInitializeEvents();
    this.checkAuthenticationStatus();
  },

  // robot state
  connect: function (robot) {
    var self = this;

    robot.onConnected =  function () {
      console.log(robot.serial + " got connected");
    };
    robot.onDisconnected =  function (status, json) {
      console.log(robot.serial + " got disconnected");
      self.guiResetAll(robot.serial);
    };
    robot.onStateChange =  function () {
      console.log(robot.serial + " got new state:", robot.state);
      self.onStateChange(robot.serial);
    };
    robot.connect();
  },

  disconnect: function (serial) {
    this.user.getRobotBySerial(serial).disconnect();
  },

  onStateChange: function (serial) {
    this.guiEnableRobotCommands(serial);
    this.guiDisplayState(serial);
  },

  getAvailableCommands: function (serial) {
    if (this.user.getRobotBySerial(serial).state) {
      return this.user.getRobotBySerial(serial).state.availableCommands;
    } else {
      return null;
    }
  },

  getAvailableServices: function (serial) {
    if (this.user.getRobotBySerial(serial).state) {
      return this.user.getRobotBySerial(serial).state.availableServices;
    } else {
      return null;
    }
  },

  // robot commands
  startOrResume: function (serial) {
    var availableCommands = this.getAvailableCommands(serial);
    if (!availableCommands) {
      return;
    }

    if (availableCommands.start) {
      this.startHouseCleaning(serial);
    } else if (availableCommands.resume) {
      this.resumeCleaning(serial);
    }
  },

  startHouseCleaning: function (serial) {
    let cleaningOptions = {
      mode: Neato.Constants.TURBO_MODE,
      modifier: Neato.Constants.HOUSE_FREQUENCY_NORMAL,
      navigationMode: Neato.Constants.EXTRA_CARE_OFF
    };

    const zoneSelect = $("#zones_select");

    if (zoneSelect.is(":visible")) {
      const zoneId = zoneSelect.val();

      cleaningOptions.boundaryId = zoneId;
    }

    this.user.getRobotBySerial(serial).startHouseCleaning(cleaningOptions);
  },

  pauseCleaning: function (serial) {
    this.user.getRobotBySerial(serial).pauseCleaning();
  },

  resumeCleaning: function (serial) {
    this.user.getRobotBySerial(serial).resumeCleaning();
  },

  stopCleaning: function (serial) {
    this.user.getRobotBySerial(serial).stopCleaning();
  },

  sendToBase: function (serial) {
    this.user.getRobotBySerial(serial).sendToBase();
  },

  findMe: function (serial) {
    this.user.getRobotBySerial(serial).findMe();
  },

  maps: function (serial) {
    var self = this;
    self.user.getRobotBySerial(serial).maps().done(function (data) {
      if(data["maps"] && data["maps"].length > 0) {
        var mapId = data["maps"][0]["id"];
        self.user.getRobotBySerial(serial).mapDetails(mapId).done(function (data) {
          window.open(data["url"]);
        }).fail(function (data) {
          self.showErrorMessage("something went wrong getting map details....");
        });
      }else {
        alert("No maps available yet. Complete at least one house cleaning to view maps.")
      }
    }).fail(function (data) {
      self.showErrorMessage("something went wrong getting robots map....");
    });
  },

  getPersistentMaps: function (serial) {
    const self = this;

    const robot = self.user.getRobotBySerial(serial);

    robot.persistentMaps().done(function (maps) {
      if (maps.length > 0) {
        const select = document.getElementById("persistent_maps_select");
        select.innerHTML = "";

        maps.forEach(map => {
          var mapId = map["id"];
          var mapName = map["name"];

          if (!mapName) {
            mapName = mapId;
          }

          const option = document.createElement("option");
          option.text = mapName;
          option.value = mapId;

          select.appendChild(option);
        });

        $("#persistent_maps_select").show();

        self.getZones(serial, maps[0].id);
      } else {
        alert("No floor plans available yet.")
      }
    }).fail(function (data) {
      self.showErrorMessage("something went wrong getting floor plans....");
    });
  },

  getZones: function (serial, mapId) {
    const self = this;

    const robot = self.user.getRobotBySerial(serial);

    robot.getMapBoundaries(mapId).done(function (result, zones) {
      const boundaries = zones.boundaries;

      if (boundaries.length > 0) {
        const select = document.getElementById("zones_select");
        select.innerHTML = "";

        boundaries.forEach(boundary => {
          var boundaryName = boundary["name"];

          if (boundaryName) {
            var boundaryId = boundary["id"];

            const option = document.createElement("option");
            option.text = boundaryName;
            option.value = boundaryId;

            select.appendChild(option);
          }
        });

        $("#zones_select").show();
      } else {
        alert("No saved zones available yet.")
      }
    }).fail(function (data) {
      self.showErrorMessage("something went wrong getting zones....");
    });
  },

  setScheduleEveryMonday: function(serial) {
    this.user.getRobotBySerial(serial).setSchedule({
      1: { mode: 1, startTime: "15:00" }
    });
  },

  setScheduleEveryDay: function(serial) {
    this.user.getRobotBySerial(serial).setSchedule({
      0: { mode: 1, startTime: "15:00" },
      1: { mode: 1, startTime: "15:00" },
      2: { mode: 1, startTime: "15:00" },
      3: { mode: 1, startTime: "15:00" },
      4: { mode: 1, startTime: "15:00" },
      5: { mode: 1, startTime: "15:00" },
      6: { mode: 1, startTime: "15:00" }
    });
  },

  checkAuthenticationStatus: function () {
    var self = this;
    this.user = new Neato.User();

    this.user.isConnected()
      .done(function () {
        self.guiHideLoginPage();
        self.guiShowDashboardPage();
        self.getDashboard();
      })
      .fail(function () {
        //show auth error only if the user attempt to login with a token
        if(self.user.authenticationError()) {
          self.guiShowAuthenticationErrorUI(self.user.authErrorDescription);
        }else if(!self.user.connected && self.user.token != null) {
          self.guiShowAuthenticationErrorUI("access denied");
        }
      });
  },

  // GUI
  guiInitializeEvents: function () {
    var self = this;

    $("#cmd_login").click(function () {
      self.user.login({
        clientId: self.clientId,
        scopes: self.scopes,
        redirectUrl: self.redirectUrl
      });
    });
    $("#cmd_logout").click(function () {
      self.user.logout()
        .done(function (data) {
          self.guiHideDashboardPage();
          self.guiShowLoginPage();
        }).fail(function (data) {
          self.showErrorMessage("something went wrong during logout...");
      });
    });
    $(document).on("click", ".cmd_start", function () {
      self.startOrResume($(this).parents(".robot").attr('data-serial'));
    });
    $(document).on("click", ".cmd_pause", function () {
      self.pauseCleaning($(this).parents(".robot").attr('data-serial'));
    });
    $(document).on("click", ".cmd_stop", function () {
      self.stopCleaning($(this).parents(".robot").attr('data-serial'));
    });
    $(document).on("click", ".cmd_send_to_base", function () {
      self.sendToBase($(this).parents(".robot").attr('data-serial'));
    });
    $(document).on("click", ".cmd_find_me", function () {
      self.findMe($(this).parents().attr('data-serial'));
    });
    $(document).on("click", ".cmd_maps", function () {
      self.maps($(this).parents().attr('data-serial'));
    });
    $(document).on("click", ".cmd_schedule_monday", function () {
      self.setScheduleEveryMonday($(this).parents().parents().attr('data-serial'));
    });
    $(document).on("click", ".cmd_schedule_every_day", function () {
      self.setScheduleEveryDay($(this).parents().parents().attr('data-serial'));
    });
    $(document).on("click", "#cleaning_mode_entire_floor", function () {
      $("#persistent_maps_select").hide();
      $("#zones_select").hide();
    });
    $(document).on("click", "#cleaning_mode_zone", function () {
      self.getPersistentMaps($(this).parents().parents().attr('data-serial'));
    });
    $(document).on("click", "#persistent_maps_select", function () {
      self.getZones($(this).parents().parents().attr('data-serial'));
    });
  },

  guiShowLoginPage: function () {
    this.hideErrorMessage();
    $("#signin").show();
  },
  guiHideLoginPage: function () {
    $("#signin").hide();
  },
  guiShowDashboardPage: function () {
    $("#dashboard").show();
  },
  guiHideDashboardPage: function () {
    $("#dashboard").hide();
  },

  getDashboard: function () {
    var self = this;

    //get user email if available
    this.user.getUserInfo()
      .done(function (data) {
        $("#user_first_name").html(data.first_name || "");
      }).fail(function (data) {
        self.showErrorMessage("something went wrong accessing user info....");
      });

    //get user robots
    this.user.getRobots()
      .done(function (robotsArray) {
        var html = "";
        var robot;
        //start polling robot state
        for (var i = 0; i < robotsArray.length; i++) {
          robot = robotsArray[i];
          self.connect(robot);
          html += self.guiRobotTemplate(robot);
        }
        $("#robot_list").html(html);
      }).fail(function (data) {
        self.showErrorMessage("something went wrong retrieving robot list....");
      });
  },

  guiRobotTemplate: function(robot) {
    return "<div class='robot grid-40 prefix-5 suffix-5' data-serial='"+robot.serial+"' data-secret_key='"+robot.secret_key+"'>" +
      "<div class='model'><img src='img/"+this.getRobotImage(robot.model)+"'></div>" +
        "<p class='name'>"+robot.name+"</p>" +
        "<p class='robot_state'>NOT AVAILABLE</p>" +
        "<a class='cmd_find_me' title='Find me'><i class='fa fa-search' aria-hidden='true'></i></a>" +
        "<a class='cmd_maps' title='Maps'><i class='fa fa-map' aria-hidden='true'></i></a>" +
        "<div class='cleaning_mode'>" +
          "<label for='cleaning_mode_entire_floor'>Entire floor</label><input type='radio' id='cleaning_mode_entire_floor' name='cleaning_mode' value='cleaning_mode_entire_floor' checked>" +
          "<label for='cleaning_mode_zone'>Zone</label><input type='radio' id='cleaning_mode_zone' name='cleaning_mode' value='cleaning_mode_zone'>" +
          "<select id='persistent_maps_select' style='display: none;'>" +
          "</select>" +
          "<select id='zones_select' style='display: none;'>" +
          "</select>" +
        "</div>" +
        "<div class='cleaning-commands'>" +
          "<a class='cmd_start disabled'><i class='fa fa-play' aria-hidden='true'></i></a>" +
          "<a class='cmd_pause disabled'><i class='fa fa-pause' aria-hidden='true'></i></a>" +
          "<a class='cmd_stop disabled'><i class='fa fa-stop' aria-hidden='true'></i></a>" +
          "<a class='cmd_send_to_base disabled'><i class='fa fa-home' aria-hidden='true'></i></a>" +
        "</div>" +
        "<div class='other-commands'>" +
          "<p>WIPE ALL EXISTING SCHEDULE AND SET IT TO:</p>" +
          "<a class='btn cmd_schedule_every_day'>Everyday at 3:00 pm</a>" +
          "<a class='btn cmd_schedule_monday'>Monday at 3:00 pm</a>" +
        "</div>" +
      "</div>";
  },

  getRobotImage: function(model) {
    if(model.toLowerCase() == "botvacconnected") return "robot_image_botvacconnected.png";
    else if(model.toLowerCase() == "botvacd3connected") return "robot_image_botvacd3connected.png";
    else if(model.toLowerCase() == "botvacd5connected") return "robot_image_botvacd5connected.png";
    else if(model.toLowerCase() == "botvacd7connected") return "robot_image_botvacd7connected.png";
    else return "robot_empty.png";
  },

  guiShowAuthenticationErrorUI: function (message) {
    this.guiShowLoginPage();
    this.showErrorMessage(message);
  },

  guiEnableRobotCommands: function (serial) {
    var availableCommands = this.getAvailableCommands(serial);
    if (!availableCommands) {
      return;
    }

    var $robotUI = $("[data-serial='" + serial + "']");

    $robotUI.find(".cmd_start").first().removeClass('disabled');
    $robotUI.find(".cmd_pause").first().removeClass('disabled');
    $robotUI.find(".cmd_stop").first().removeClass('disabled');
    $robotUI.find(".cmd_send_to_base").first().removeClass('disabled');

    if(!(availableCommands.start || availableCommands.resume)) $robotUI.find(".cmd_start").first().addClass('disabled');
    if(!availableCommands.pause) $robotUI.find(".cmd_pause").first().addClass('disabled');
    if(!availableCommands.stop) $robotUI.find(".cmd_stop").first().addClass('disabled');
    if(!availableCommands.goToBase) $robotUI.find(".cmd_send_to_base").first().addClass('disabled');

    //check available services to enable robot features
    var availableServices = this.getAvailableServices(serial);
    if (!availableServices) {
      return;
    }

    if(!availableServices["findMe"]) $robotUI.find(".cmd_find_me").first().hide();
    else $robotUI.find(".cmd_find_me").first().show();

    if(!availableServices["maps"]) $robotUI.find(".cmd_maps").first().hide();
    else $robotUI.find(".cmd_maps").first().show();
  },

  guiDisableRobotCommands: function (serial) {
    var $robotUI = $("[data-serial='" + serial + "']");

    $robotUI.find(".cmd_start").first().addClass('disabled');
    $robotUI.find(".cmd_pause").first().addClass('disabled');
    $robotUI.find(".cmd_stop").first().addClass('disabled');
    $robotUI.find(".cmd_send_to_base").first().addClass('disabled');
    $robotUI.find(".cmd_find_me").first().hide();
    $robotUI.find(".cmd_maps").first().hide();
  },

  guiDisplayState: function (serial) {
    var $robotState = $("div[data-serial='" + serial + "']");

    var prettyState = "NOT AVAILABLE";
    var robot_state = this.user.getRobotBySerial(serial).state.state;
    switch (robot_state) {
      case 1:
        prettyState = "IDLE";
        break;
      case 2:
        prettyState = "BUSY";
        break;
      case 3:
        prettyState = "PAUSED";
        break;
      case 4:
        prettyState = "ERROR";
        break;
      default:
        prettyState = "NOT AVAILABLE";
    }

    $robotState.find(".robot_state").html(prettyState);
  },

  guiResetState: function (serial) {
    var $robotState = $("div[data-serial='" + serial + "']");
    $robotState.find(".robot_state").html("NOT AVAILABLE");
  },

  guiResetAll: function (serial) {
    this.guiResetState(serial);
    this.guiDisableRobotCommands(serial);
  },

  showErrorMessage: function(message) {
    $("div.error").html(message).show();
  },
  hideErrorMessage: function() {
    $("div.error").hide();
  }
};
