var BUFFER_SIZE = 1000;
var DEFAULT_TIME_FRAME = 20; // s

function MonitorView(container) {
    var labels = function () {
        var buff = [];
        for(var i= 0; i<=BUFFER_SIZE; i++)
            buff.push(i);
        return buff;
    }();
    var timeFrame = DEFAULT_TIME_FRAME;
    var options = {
        axisX: {
            // The offset of the labels to the chart area
            offset: 40,
            position: 'end',
            lineSmooth: false,
            showPoint: false,
            // If labels should be shown or not
            showLabel: true,
            // If the axis grid should be drawn or not
            showGrid: true,
            // Interpolation function that allows you to intercept the value from the axis label
            labelInterpolationFnc: function(value) {
                if(value%100 == 0)
                    return timeFrame*value/BUFFER_SIZE;
                else
                    return '';
            }
        },
        showPoint: false,
        lineSmooth: false,
        fullWidth: true,
        chartPadding: {
            right: 40
        }
    };

    var data = [[0]];
    var chart = new Chartist.Line(container, {labels: labels, series: data}, options);

    var onPlay = function() {console.log("play !");};
    var onStop = function() {console.log("stop !");};

    $("#playChart").hide().click(function () {
        $("#playChart").hide();
        $("#stopChart").show();
        onPlay();
    });
    $("#stopChart").click(function () {
        $("#playChart").show();
        $("#stopChart").hide();
        onStop();
    });
    function render(data) {
        chart.update({labels: labels, series: data});
    }
    function updateTimeFrame(tf) {
        timeFrame = tf;
        chart.update();
    }

    return {
        render: render,
        timeFrame: updateTimeFrame,
        stop: function (callback) {
            onStop = callback;
        },
        play: function (callback) {
            onPlay = callback;
        }
    }
}
