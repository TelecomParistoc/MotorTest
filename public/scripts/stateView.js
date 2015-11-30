function StateView(container) {
    var PIDupdateCallback = function(coeffs) { console.dir(coeffs);};

    $(container).find("#updatePID").click(function () {
        var pid = {
            Kp: parseInt($("#Kp").val()),
            Ki: parseInt($("#Ki").val()),
            Kd: parseInt($("#Kd").val())
        };
        if(isNaN(pid.Kp) || isNaN(pid.Ki) || isNaN(pid.Kd))
            alert("Coefficients PID non valides");
        else
            PIDupdateCallback(pid);
    });

    function render(state) {
        state.each(function (key, value) {
            if(key == "Ki" || key == "Kp" || key == "Kd")
                $(container).find("#"+key).val(value);
            else if(key != "Rsamples" && key != "Lsamples")
                $(container).find("#"+key).html(value);
        });
    }
    function setPIDupdateCallback(callback) {
        PIDupdateCallback = callback
    }
    return {
        render: render,
        PIDupdate: setPIDupdateCallback
    }
}
