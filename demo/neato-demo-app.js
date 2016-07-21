var NeatoDemoApp = {
  user: null,

  initialize: function () {
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
    this.user.getRobotBySerial(serial).startCleaning({
      category: 2,
      mode: 1,
      modifier: 1,
      navigationMode: 1
    });
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
        client_id: "1a7c62d101668075900243343265f1e8354b7e9fd2faefcee3774551f809733d",
        scopes: "control_robots+email",
        redirect_url: "https://localhost:63342/neato-sdk-js/demo/index.html"
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
      self.sendToBase($(this).parents().parent().attr('data-serial'));
    });
    $(document).on("click", ".cmd_find_me", function () {
      self.findMe($(this).parents().attr('data-serial'));
    });
    $(document).on("click", ".cmd_schedule_monday", function () {
      self.setScheduleEveryMonday($(this).parents().parents().attr('data-serial'));
    });
    $(document).on("click", ".cmd_schedule_every_day", function () {
      self.setScheduleEveryDay($(this).parents().parents().attr('data-serial'));
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
        $("#user_email").html(data.email || "");
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
      "<div class='model'><img src='img/botvacconnected.png'></div>" +
      "<p class='name'>"+robot.name+"</p>" +
      "<p class='robot_state'>NOT AVAILABLE</p>" +
      "<a class='cmd_find_me'><i class='fa fa-search' aria-hidden='true'></i></a>" +
      "<div class='cleaning-commands'>" +
      "<a class='cmd_start disabled'><i class='fa fa-play' aria-hidden='true'></i></a>" +
      "<a class='cmd_pause disabled'><i class='fa fa-pause' aria-hidden='true'></i></a>" +
      "<a class='cmd_stop disabled'><i class='fa fa-stop' aria-hidden='true'></i></a>" +
      "<a class='cmd_send_to_base disabled'><i class='fa fa-undo' aria-hidden='true'></i></a>" +
      "</div>" +
      "<div class='other-commands'>" +
      "<p>Scheduling</p>" +
      "<a class='btn cmd_schedule_every_day'>Everyday at 3:00 pm</a>" +
      "<a class='btn cmd_schedule_monday'>Monday at 3:00 pm</a>" +
      "</div>" +
      "</div>";
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
  },

  guiDisableRobotCommands: function (serial) {
    var $robotUI = $("[data-serial='" + serial + "']");

    $robotUI.find(".cmd_start").first().addClass('disabled');
    $robotUI.find(".cmd_pause").first().addClass('disabled');
    $robotUI.find(".cmd_stop").first().addClass('disabled');
    $robotUI.find(".cmd_send_to_base").first().addClass('disabled');
    $robotUI.find(".cmd_find_me").first().hide();
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

$(function () {
  NeatoDemoApp.initialize();
});
