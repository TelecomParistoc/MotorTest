var ffi = require('ffi');
var ref = require('ref');

var voidPtr = ref.refType('void');
var simpleCallback = ffi.Function('void', []);
var motionCallback = ffi.Function('void', [voidPtr]);

var lib = ffi.Library('./../build/librobotdriver', {
    // motioncontroller
    'initMotionController': [ 'int', [] ],
    'getMaxAcceleration': [ 'double', [] ],
    'setMaxAcceleration': [ 'void', ['double'] ],
    'setBlockingCallback': [ 'void', [simpleCallback] ],
    // speedcontroller :
    'queueSpeedChange': [ 'void', ['double', motionCallback]],
    'queueSpeedChangeAt': [ 'void', ['double', 'double', motionCallback]],
    'queueStopAt': [ 'void', ['double', motionCallback] ],
    'clearMotionQueue': ['void', []],
    'getDistanceTolerance': [ 'double', [] ],
    'setDistanceTolerance': [ 'void', ['double'] ],
    'getRobotDistance': [ 'double', [] ],
    'setRobotDistance': [ 'void', ['double'] ],
    'getTargetSpeed' : ['double', []],
    'fastSpeedChange' : ['void', ['double']],
    // headingcontroller :
    'getTargetHeading': [ 'double', [] ],
    'setTargetHeading': [ 'void', ['double', simpleCallback] ],
    'turnOf': [ 'void', ['double', simpleCallback] ],
    'getCurrentHeading': [ 'double', [] ],
    'getHeadingTolerance': [ 'double', [] ],
    'setHeadingTolerance': [ 'void', ['double'] ],
    'getMaxDiffSpeed': [ 'double', [] ],
    'setMaxDiffSpeed': [ 'void', ['double'] ],
    'enableHeadingControl' : ['void', ['int'] ]
});

module.exports = lib;
