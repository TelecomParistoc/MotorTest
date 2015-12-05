function StateView(container) {
    var PIDupdateCallback = function(coeffs) { console.dir(coeffs);};
    var moveCallback = function(move) { console.dir(move);};

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
    $(container).find("#move").click(function () {
        var move = {
            Rdist: parseInt($("#moveDist").val()),
            Ldist: parseInt($("#moveDist").val()),
            Rspeed: parseFloat($("#moveSpeed").val()),
            Lspeed: parseFloat($("#moveSpeed").val())
        }
        if(isNaN(move.Rdist) || isNaN(move.Rspeed))
            alert("Vitesse et/ou distance non valide");
        else
            moveCallback(move);
    });
    $(container).find("#return").click(function () {
        var move = {
            Rdist: parseInt($("#moveDist").val()),
            Ldist: parseInt($("#moveDist").val()),
            Rspeed: -parseFloat($("#moveSpeed").val()),
            Lspeed: -parseFloat($("#moveSpeed").val())
        }
        if(isNaN(move.Rdist) || isNaN(move.Rspeed))
            alert("Vitesse et/ou distance non valide");
        else
            moveCallback(move);
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
    function setMoveCallback(callback) {
        moveCallback = callback
    }
    return {
        render: render,
        PIDupdate: setPIDupdateCallback,
        move: setMoveCallback
    }
}
