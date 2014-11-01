function html_escape(a){
    return a.replace('&', '&amp;', 'g')
            .replace('<', '&lt;', 'g')
            .replace('>', '&gt;', 'g')
            .replace('"', '&quot;', 'g')
            .replace("'", '&#39;', 'g');
}

function pretty_date(ts) {
function pretty_date(ts) {
    var timestamp = new Date().getTime() / 1000;
    var second_diff = timestamp - ts;
    var day_diff = Math.floor(second_diff / 86400);
    if (day_diff < 0) {
        return "";
    }
    if (day_diff == 0) {
        if (second_diff < 10) {
            return "just now";
        }
        if (second_diff < 60) {
            return second_diff + " seconds ago";
        }
        if (second_diff < 120) {
            return "a minute ago";
        }
        if (second_diff < 3600) {
            return Math.floor(second_diff / 60) + " minutes ago";
        }
        if (second_diff < 7200) {
            return "an hour ago";
        }
        if (second_diff < 86400) {
            return Math.floor(second_diff / 3600) + " hours ago";
        }
    }
    if (day_diff == 1) {
        return "Yesterday";
    }
    if (day_diff < 7) {
        return day_diff + " days ago";
    }
    if (day_diff < 31) {
        return Math.floor(day_diff / 7) + " weeks ago";
    }
    if (day_diff < 365) {
        return Math.floor(day_diff / 30) + " months ago";
    }
    return Math.floor(day_diff / 365) + " years ago";
}

function set_color () {
    //设置内容背景颜色
    var color_list = ["#FAB5A5","#D1E1C6","#FFFF99","#99CCFF"];
    var myDate = new Date();
    var sec = myDate.getSeconds();
    $.each($(".post"),function(idx,val){
        $(this).css({"background-color":color_list[(sec+idx)%color_list.length]});
    });
}

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
            var obj = JSON.parse(message.message);
            var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8"><div class="post">'
            +'<a href="http://www.baidu.com" target="_blank">'
            +'<p class="text-left info">'
            +'#474 点:63 评:7'
            +'</p><p class="text-left">'
            +html_escape(obj.content)
            +'</p><p class="text-right">'
            +html_escape(obj.nickname)
            +'</p><p class="text-right">'
            +'3 minutes ago'
            +'</p>'
            +'</a>'
            +'</div></div><div class="col-md-2"></div></div>';
            $(".post-list").prepend(HTML);
            set_color();
        }
    }
};

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

$(function(){
    //设置顶部滚动文字
    $("#twitter li:not(:first)").css("display","none");
    var B=$("#twitter li:last");
    var C=$("#twitter li:first");
    setInterval(function(){
    if(B.is(":visible")){
    C.fadeIn(500).addClass("in");B.hide()
    }else{
    $("#twitter li:visible").addClass("in");
    $("#twitter li.in").next().fadeIn(500);
    $("li.in").hide().removeClass("in")}
    },3000); //每3秒钟切换一条，你可以根据需要更改

    //设置下拉菜单样式
    //$('select[name="inverse-dropdown"], select[name="inverse-dropdown-optgroup"], select[name="inverse-dropdown-disabled"]').select2({dropdownCssClass: 'select-inverse-dropdown'});
    $('select[name="category"]').select2({dropdownCssClass: 'select-inverse-dropdown'});

    //首次加载内容
    $.getJSON("/w/1", function(data) {
        var obj = $.parseJSON(data);
        if(obj.statusCode==200){
            var items = [];
            $.each(obj.posts,function(idx,post){
                items.push( "<li id='" + key + "'>" + val + "</li>" );
            });
        }else{
            return;
        }
      $( "<ul/>", {
        "class": "my-new-list",
        html: items.join( "" )
      }).appendTo( "body" );
    });
    //设置post块颜色
    set_color();

    //开启ws
    updater.start();

    $("#submit_btn").click(function() {
        var msg = {
            content:$("#content").val(),
            category:$("#category").val(),
            nickname:$("#nickname").val()
        }
        $.post("/post",{
            _xsrf: getCookie("_xsrf"),
            kind: "post",
            message: $("#content").val(),
            author: $("#nickname").val(),
            category: $("#category").val()
        },function (data,textStatus) {
            console.log(data);
        });
        updater.socket.send(JSON.stringify(msg));
        console.log(JSON.stringify(msg));
        return false;
    });

});