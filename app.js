var express = require('express');
var path = require('path');
var driver = require('./motordriver.js');
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

// init driver
driver.init();

io.on('connection', function (socket) {
    var state = {
        Rspeed: driver.Rspeed().round(2),
        Lspeed: driver.Lspeed().round(2),
        Rdistance: driver.Rdistance().round(2),
        Ldistance: driver.Ldistance().round(2),
        Kp: driver.Kp(),
        Ki: driver.Ki(),
        Kd: driver.Kd()
    };
    console.log("New client, sending data :");
    console.dir(state);
    io.emit("motordata", state);

    socket.on("pid", function(data) {
        sampleSpeed.cancel();
        updateMotorData.cancel();
        console.log("Updating PID");
        (function () {
          if(typeof data.Kp == "number" && !isNaN(data.Kp))
              driver.Kp(data.Kp);
          if(typeof data.Ki == "number" && !isNaN(data.Ki))
              driver.Ki(data.Ki);
          if(typeof data.Kd == "number" && !isNaN(data.Kd))
              driver.Kd(data.Kd);
          sampleSpeed.every(20);
          updateMotorData.every(100);
        }).delay(20);
    });
    socket.on("move", function(data) {
        if(typeof data.Rdist == "number" && !isNaN(data.Rdist)
          && typeof data.Ldist == "number" && !isNaN(data.Ldist)
          && typeof data.Rspeed == "number" && !isNaN(data.Rspeed)
          && typeof data.Lspeed == "number" && !isNaN(data.Lspeed)) {
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

var filterValues = [];
function medianFilter(value) {
    filterValues.push(value);
    if(filterValues.length==4) {
        filterValues.shift();
        return filterValues.slice(0).sort()[1];
    } else {
        return filterValues.last();
    }
}

function updateMotorData() {
    io.emit("motordata", {
        Rspeed: driver.Rspeed().round(2),
        Lspeed: driver.Lspeed().round(2),
        Rdistance: driver.Rdistance().round(2),
        Ldistance: driver.Ldistance().round(2),
        Rsamples: RspeedSamples,
        Lsamples: LspeedSamples,
        //heading: medianFilter(driver.heading().round(2))
    });
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
