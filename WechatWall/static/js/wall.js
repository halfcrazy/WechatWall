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

function load_category(category,page){
    //首次加载内容
    $.getJSON("/api/w/"+category+"?p="+page, function(data) {
        var obj = data;
        if(obj.statusCode==200){
            if(obj.posts.length>0){
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
                $(".post-list").append(items.join(""));
                //设置post块颜色
                set_color();
            }
            else{
                $("#pinterestDone").show();
            }
        }
        else{
            return;
        }
    });
}
$(function(){
    //设置顶部滚动文字
    set_scroll_notification();
    //添加回到顶部按钮
    back_to_top();

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

    //处理底部加载完毕
    $("#pinterestDone").hide();
    page_num = 1;
    load_category(0,page_num);
    $(window).scroll(function(){
        if ($(document).height() - $(this).scrollTop() - $(this).height()<100){
            page_num++;
            load_category(0,page_num);
        }
    });

    //开启ws
    //updater.start();

    $("#submit_btn").click(function() {
        var message = $("#content").val();
        var author = $("#nickname").val();
        var category = $("#category").val(); 
        var ts = Date.parse(new Date()); 

        $.post("/api/post",{
            _xsrf: getCookie("_xsrf"),
            kind: "post",
            message: message,
            author: author,
            category: category,
        },function (data,textStatus) {
            if(data.statusCode==200){
                var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8"><div class="post">'
                    +'<a href="/t/'+(data.post_id-1)+'" target="_blank">'
                    +'<p class="text-left info">'
                    +'#'+(data.post_id-1)
                    +' 点:0 评:0'
                    +'</p><p class="text-left">'
                    +html_escape(message)
                    +'</p><p class="text-right">'
                    +html_escape(author)
                    +'</p><p class="text-right">'
                    +'just now'
                    +'</p>'
                    +'</a>'
                    +'</div></div><div class="col-md-2"></div></div>';
                $(".post-list").prepend(HTML);
                set_color();
                layer.msg('发送成功', 2, -1);
                $("#content").val("");
            }
            else{
                layer.msg('发送失败', 2, -1);
            }

        });
        //updater.socket.send(JSON.stringify(msg));
        return false;
    });

});