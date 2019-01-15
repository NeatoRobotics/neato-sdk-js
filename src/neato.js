var Neato = {
  // this field reference the session user
  user: null,
  // this contains all possible robot services definitions
  Services: {},
  // this constains all constants
  Constants:{
    CLEAN_HOUSE_MODE : 2,
    CLEAN_SPOT_MODE : 3,
    CLEAN_MAP_MODE : 4,
    MANUAL_CLEANING_MODE : 1,
    ECO_MODE : 1,
    TURBO_MODE : 2,
    SPOT_AREA_SMALL : 200,//cm
    SPOT_AREA_LARGE : 400,//cm
    HOUSE_FREQUENCY_NORMAL : 1,
    HOUSE_FREQUENCY_DOUBLE : 2,
    SPOT_FREQUENCY_NORMAL : 1,
    SPOT_FREQUENCY_DOUBLE : 2,
    EXTRA_CARE_OFF : 1,
    EXTRA_CARE_ON : 2
  }
};