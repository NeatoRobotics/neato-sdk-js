Neato.Services.houseCleaning_basic4 = {

  startHouseCleaning: function(options) {
    options = options || {};

    var message = {
      reqId: "1",
      cmd: "startCleaning",
      params: {
        category: Neato.Constants.CLEAN_HOUSE_MODE,
        mode: options.mode || Neato.Constants.TURBO_MODE,
        navigationMode: options.navigationMode || Neato.Constants.EXTRA_CARE_OFF
      }
    };

    if (options.boundaryId) {
      message.params.category = Neato.Constants.CLEAN_MAP_MODE;
      message.params.boundaryId = options.boundaryId;
    }

    return this.__call(message);
  },
  supportEcoTurboMode: function() {
    return true;
  },
  supportFrequency: function() {
    return true;
  },
  supportExtraCare: function() {
    return true;
  },
  stopCleaning: Neato.Services.cleaning.stopCleaning,
  pauseCleaning: Neato.Services.cleaning.pauseCleaning,
  resumeCleaning: Neato.Services.cleaning.resumeCleaning,
  sendToBase: Neato.Services.cleaning.sendToBase
};
