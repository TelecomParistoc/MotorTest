var express = require('express');
var path = require('path');
var driver = require('./motordriver.js');
var motion = require('./motioncontroller.js');
require('sugar');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('MotorTest listening at http://%s:%s', host, port);
});

var io = require('socket.io')(server);

var RspeedSamples = [];
var LspeedSamples = [];
var RtargetDist = -232323;
var LtargetDist = -232323;

function isNumber(number) {
    return typeof number == "number" && !isNaN(number);
}
function getState(includePIDcoeffs) {
    var state = {
        Rspeed: driver.Rspeed().round(2),
        Lspeed: driver.Lspeed().round(2),
        Rdistance: driver.Rdistance().round(2),
        Ldistance: driver.Ldistance().round(2),
        Rsamples: RspeedSamples,
        Lsamples: LspeedSamples,
        heading: driver.heading().round(2)
    };
    if(includePIDcoeffs) {
        state.Kp = driver.Kp();
        state.Ki = driver.Ki();
        state.Kd = driver.Kd();
    }
    return state;
}

// init driver
driver.init();

io.on('connection', function (socket) {
    console.log("New client, sending data");
    io.emit("motordata", getState(true));

    socket.on("pid", function(data) {
        sampleSpeed.cancel();
        updateMotorData.cancel();
        console.log("Updating PID");
        (function () {
          if(isNumber(data.Kp))
              driver.Kp(data.Kp);
          if(isNumber(data.Ki))
              driver.Ki(data.Ki);
          if(isNumber(data.Kd))
              driver.Kd(data.Kd);
          sampleSpeed.every(20);
          updateMotorData.every(100);
        }).delay(20);
    });
    socket.on("move", function(data) {
        if(isNumber(data.Rdist) && isNumber(data.Ldist) && isNumber(data.Rspeed) && isNumber(data.Lspeed)) {
            sampleSpeed.cancel();
            driver.Rdistance(0);
            driver.Ldistance(0);
            driver.Lspeed(data.Lspeed);
            driver.Rspeed(data.Rspeed);
            (function () {
                RtargetDist = data.Rdist.abs();
                LtargetDist = data.Ldist.abs();
                sampleSpeed.every(20);
            }).delay(20);
        }
    });
});


function updateMotorData() {
    io.emit("motordata", getState());
    RspeedSamples = [];
	LspeedSamples = [];
}
updateMotorData.every(100);

function sampleSpeed() {
	RspeedSamples.push(driver.Rspeed());
	LspeedSamples.push(driver.Lspeed());
    if(RtargetDist > 0 && driver.Rdistance().abs() >= RtargetDist) {
        driver.Rspeed(0);
        RtargetDist = -232323;
    }
    if(LtargetDist > 0 && driver.Ldistance().abs() >= LtargetDist) {
        driver.Lspeed(0);
        LtargetDist = -232323;
    }
}
sampleSpeed.every(20);
