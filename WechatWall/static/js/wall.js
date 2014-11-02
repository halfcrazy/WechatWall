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
            if(obj.type=="message"){
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
            }else{
                console.log(obj);
            }
        }
    }
};

$(function(){
    //设置顶部滚动文字
    set_scroll_notification();

    //设置下拉菜单样式
    //$('select[name="inverse-dropdown"], select[name="inverse-dropdown-optgroup"], select[name="inverse-dropdown-disabled"]').select2({dropdownCssClass: 'select-inverse-dropdown'});
    $('select[name="category"]').select2({dropdownCssClass: 'select-inverse-dropdown'});

    //初始化category-nav
    $("#category-nav li").click(function() {
        if($(this["class"!="active"])){
            $(this).attr("class","active");
            $(this).siblings('li').attr("class","");
        }
    });

    //添加手势支持,切换分类
    var myElement = $(".post-list")[0];
    var mc = new Hammer(myElement);
    var last_gesture = "";
    mc.on("panend panleft panright", function(ev) {
        if(ev.type=="panend"){
            if(last_gesture=="panright"){
                $("#category-nav li[class=active]").prev("li").trigger("click");
            }else if(last_gesture=="panleft"){
                $("#category-nav li[class=active]").next("li").trigger("click");
            }
        }else{
            last_gesture = ev.type;
        }
    });

    //首次加载内容
    $.getJSON("/api/w/0", function(data) {
        var obj = data;
        if(obj.statusCode==200){
            console.log(obj.posts);
            var items = [];
            $.each(obj.posts,function(idx,post){
                //post.category_id,post_id
                var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8"><div class="post">'
                +'<a href="/t/'+post.id+'" target="_blank">'
                +'<p class="text-left info">'
                +'#'+post.id
                +' 点:'+post.click_num+' 评:'+post.comment_num
                +'</p><p class="text-left">'
                +html_escape(post.content)
                +'</p><p class="text-right">'
                +html_escape(post.author)
                +'</p><p class="text-right">'
                +pretty_date(post.created_at)
                +'</p>'
                +'</a>'
                +'</div></div><div class="col-md-2"></div></div>';
                items.push(HTML);
            });
        }else{
            return;
        }
        $(".post-list").prepend(items.join(""));
        //设置post块颜色
        set_color();
    });

    //开启ws
    updater.start();

    $("#submit_btn").click(function() {
        var msg = {
            content:$("#content").val(),
            category:$("#category").val(),
            nickname:$("#nickname").val()
        }
        $.post("/api/post",{
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