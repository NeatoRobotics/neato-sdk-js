Neato.Services.preferences_advanced1 = {
  getPreferences: function() {
    var message = { reqId: "1", cmd: "getPreferences" };
    return this.__call(message);
  },
  setPreferences: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "setPreferences",
      params: {
        robotSounds: options.robotSounds || false,
        dirtbinAlert: options.dirtbinAlert || false,
        allAlerts: options.allAlerts || false,
        leds: options.leds || false,
        buttonClicks: options.buttonClicks || false,
        dirtbinAlertReminderInterval: options.dirtbinAlertReminderInterval || 150,
        filterChangeReminderInterval: options.filterChangeReminderInterval || 43200,
        brushChangeReminderInterval: options.brushChangeReminderInterval || 172800,
        clock24h: options.clock24h || false,
        locale: options.locale || "en"
      }
    };
    return this.__call(message);
  }
}
