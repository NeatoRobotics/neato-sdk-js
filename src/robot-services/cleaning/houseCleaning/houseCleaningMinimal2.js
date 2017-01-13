Neato.Services.houseCleaning_minimal2 = {

  startHouseCleaning: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "startCleaning",
      params: {
        category: Neato.Constants.CLEAN_HOUSE_MODE,
        navigationMode: options.navigationMode || Neato.Constants.EXTRA_CARE_OFF
      }
    };
    return this.__call(message);
  },

  stopCleaning: Neato.Services.cleaning.stopCleaning,
  pauseCleaning: Neato.Services.cleaning.pauseCleaning,
  resumeCleaning: Neato.Services.cleaning.resumeCleaning,
  sendToBase: Neato.Services.cleaning.sendToBase
};
