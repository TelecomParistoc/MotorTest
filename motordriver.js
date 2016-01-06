var ffi = require('ffi');

var lib = ffi.Library('librobotdriver', {
  'initMotorDriver': [ 'int', [] ],
  'getLdistance': [ 'double', [] ],
  'getRdistance': [ 'double', [] ],
  'getRspeed': [ 'double', [] ],
  'getLspeed': [ 'double', [] ],
  'setLdistance': [ 'void', ['double'] ],
  'setRdistance': [ 'void', ['double'] ],
  'setRspeed': [ 'void', ['double'] ],
  'setLspeed': [ 'void', ['double'] ],
  'getKp': [ 'uint8', [] ],
  'getKi': [ 'uint8', [] ],
  'getKd': [ 'uint8', [] ],
  'setKp': [ 'void', ['uint8'] ],
  'setKi': [ 'void', ['uint8'] ],
  'setKd': [ 'void', ['uint8'] ],
  'getRobotHeading': [ 'double', [] ],
  'setRobotHeading': [ 'void', ['double'] ],
  'getMotorDriverUpdateFreq': [ 'int', [] ],
  'setMotorDriverUpdateFreq': [ 'void', ['int'] ]
});

module.exports = {
    init: lib.initMotorDriver,
    Lspeed: function(speed) {
        if(typeof speed != "undefined") {
            lib.setLspeed(speed);
        } else {
            return lib.getLspeed();
        }
    },
    Rspeed: function(speed) {
        if(typeof speed != "undefined") {
            lib.setRspeed(speed);
        } else {
            return lib.getRspeed();
        }
    },
    Ldistance: function(distance) {
        if(typeof distance != "undefined") {
            lib.setLdistance(distance);
        } else {
            return lib.getLdistance();
        }
    },
    Rdistance: function(distance) {
        if(typeof distance != "undefined") {
            lib.setRdistance(distance);
        } else {
            return lib.getRdistance();
        }
    },
    Kp: function(value) {
        if(typeof value != "undefined") {
            lib.setKp(value);
        } else {
            return lib.getKp();
        }
    },
    Ki: function(value) {
        if(typeof value != "undefined") {
            lib.setKi(value);
        } else {
            return lib.getKi();
        }
    },
    Kd: function(value) {
        if(typeof value != "undefined") {
            lib.setKd(value);
        } else {
            return lib.getKd();
        }
    },
    heading: function(value) {
        if(typeof value != "undefined") {
            lib.setRobotHeading(value);
        } else {
            return lib.getRobotHeading();
        }
    },
    updateFrequency: function(value) {
        if(typeof value != "undefined") {
            lib.setMotorDriverUpdateFreq(value);
        } else {
            return lib.getMotorDriverUpdateFreq();
        }
    },
};
