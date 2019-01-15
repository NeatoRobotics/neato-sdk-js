Neato.Services.maps_macro1 = {
  maps: function() {
    return Neato.user.__getRobotMaps(this.serial);
  },
  mapDetails: function(mapId) {
    return Neato.user.__getMapDetails(this.serial, mapId);
  }
}
