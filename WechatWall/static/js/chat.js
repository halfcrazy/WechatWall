$(function() {
    updater.start();
    $("#submit").click(function() {
        var message = {
            id:id,
            author:$("#author").val(),
            msg:$("#msg").val()
        };
        updater.socket.send(JSON.stringify(message));
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
        $(".content").append("<p>"+message+"</p>");
    }
};
