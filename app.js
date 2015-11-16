var express = require('express');
var path = require('path');
var driver = require('./motordriver.js');
require("sugar");

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('MotorTest listening at http://%s:%s', host, port);
});

var io = require("socket.io")(server);

var RspeedSamples = [];
var LspeedSamples = [];

// init driver
driver.init();

io.on('connection', function (socket) {
    var state = {
        Rspeed: driver.Rspeed(),
        Lspeed: driver.Lspeed(),
        Rdistance: driver.Rdistance(),
        Ldistance: driver.Ldistance(),
        Kp: driver.Kp(),
        Ki: driver.Ki(),
        Kd: driver.Kd()
    };
    console.log("New client, sending data :");
    console.dir(state);
    io.emit("motordata", state);

    socket.on("pid", function(data) {
        console.log("Updating PID");
        if(typeof data.Kp == "number" && !isNaN(data.Kp))
            driver.Kp(data.Kp);
        if(typeof data.Ki == "number" && !isNaN(data.Ki))
            driver.Ki(data.Ki);
        if(typeof data.Kd == "number" && !isNaN(data.Kd))
            driver.Kd(data.Kd);
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
        Rdistance: driver.Rdistance(),
        Ldistance: driver.Ldistance(),
        Rsamples: RspeedSamples,
        Lsamples: LspeedSamples,
        heading: medianFilter(driver.heading().round(2))
    });
    RspeedSamples = [];
	LspeedSamples = [];
}
updateMotorData.every(100);

function sampleSpeed() {
	RspeedSamples.push(driver.Rspeed());
	LspeedSamples.push(driver.Lspeed());
}
sampleSpeed.every(20);
