function html_escape(a){
    return a.replace('&', '&amp;', 'g')
            .replace('<', '&lt;', 'g')
            .replace('>', '&gt;', 'g')
            .replace('"', '&quot;', 'g')
            .replace("'", '&#39;', 'g');
}

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
            return Math.floor(second_diff) + " seconds ago";
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

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function set_scroll_notification () {
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

function back_to_top () {
    // hide #back-top first
    $(".back-to-top").hide();
    // fade in .back-to-top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('.back-to-top a').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
}