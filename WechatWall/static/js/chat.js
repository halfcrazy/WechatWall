$(function() {
    updater.start();
    $("#submit").click(function() {
        /*
        var message = {
            id:id,
            author:$("#author").val(),
            msg:$("#msg").val()
        };
        */
        //updater.socket.send(JSON.stringify(message));
        updater.socket.send($("#msg").val());
        console.log("send:"+$("#msg").val());
        return false;
    });
});

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/ws";
        updater.socket = new WebSocket(url);
        updater.socket.onmessage = function(event) {
            updater.showMessage(JSON.parse(event.data));
        }
    },


    showMessage: function(message) {
        console.log(message);
        if(message.type=="message"){
            $(".content").append("<p>"+message.message+"</p>");
        }
    }
};
