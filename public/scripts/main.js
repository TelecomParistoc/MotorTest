Object.extend();

function Monitor(container) {
    var view = MonitorView(container);
    var data = [[0]];
    function addValue(val, dataArray) {
        if(!isNaN(parseFloat(val))) {
            dataArray.push(val);
            if(dataArray.length > BUFFER_SIZE) {
                dataArray.shift();
            }
        }
    }
    function addData(val) {
        addValue(val, data[0]);
        view.render(data);
    }
    function addMultiple(values) {
        values.each(function(val) {
            addValue(val, data[0]);
        });
        view.render(data);
    }
    return {
        add: addData,
        addMultiple : addMultiple
    }
}

$(function () {
    var socket = io.connect('http://'+window.location.hostname+':3002');
    var Rchart = Monitor("#Rspeed-chart");
    var Lchart = Monitor("#Lspeed-chart");
    var state = StateView("#info");

    state.PIDupdate(function (pid) {
        socket.emit("pid", pid);
    });
    socket.on("motordata", function (data) {
        state.render(data);
        if(typeof data.Rsamples == "object" && data.Rsamples.isArray())
            Rchart.addMultiple(data.Rsamples);
        if(typeof data.Lsamples == "object" && data.Lsamples.isArray())
            Lchart.addMultiple(data.Lsamples);
    });
    /*
    var i=0;
    var buff = [];
    function mySine(x) {
        return Math.sin(2*Math.PI*i/1000)+ 0.1*Math.sin(2*Math.PI*i/5);
    }
    setInterval(function () {
        buff = [];
        (5).times(function () {buff.push(mySine(i)); i++;});
        Rchart.addMultiple(buff);
        Lchart.addMultiple(buff);
    }, 100);*/
});
