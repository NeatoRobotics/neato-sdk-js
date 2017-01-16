Neato.Services.preferences_basic1 = {
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
        dirtbinAlertReminderInterval: options.dirtbinAlertReminderInterval || 150,
        filterChangeReminderInterval: options.filterChangeReminderInterval || 43200,
        brushChangeReminderInterval: options.brushChangeReminderInterval || 172800
      }
    };
    return this.__call(message);
  }
};
