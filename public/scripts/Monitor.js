Object.extend();

function Monitor(container) {
    var view = MonitorView(container);
    var data = [[0]];
    var playing = true;

    function stop() {
        playing = false;
    }
    function start() {
        data = [[0]];
        playing = true;
    }
    view.play(start);
    view.stop(stop);

    function addValue(val, dataArray) {
        if(!isNaN(parseFloat(val))) {
            dataArray.push(val);
            if(dataArray.length > BUFFER_SIZE) {
                dataArray.shift();
            }
        }
    }
    function addData(val) {
        if(playing) {
            addValue(val, data[0]);
            view.render(data);
        }
    }
    function addMultiple(values) {
        if(playing) {
            values.each(function(val) {
                addValue(val, data[0]);
            });
            view.render(data);
        }
    }
    return {
        add: addData,
        addMultiple : addMultiple,
        start: start,
        stop: stop
    }
}
