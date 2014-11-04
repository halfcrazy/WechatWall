function load_comment_post (post_id) {
    //首次加载内容
    $.getJSON("/api/t/"+post_id, function(data) {
        var obj = data;
        if(obj.statusCode==200){
            console.log(obj);
            var HTML = '<div class="row">'
                          +'<div class="col-md-8 col-md-offset-2 post-to-comment">'
                            +'<a href="/"><<回到微信墙</a>'
                            +'<p class="text-left">这是一条<em>'+get_category(obj.post.category_id)+'</em></p>'
                            +'<blockquote>'
                              +'<p>'+obj.post.content+'</p>'
                            +'</blockquote>'
                            +'<p class="text-right">'+obj.post.author+'</p>'
                            +'<p class="text-right">'+pretty_date(obj.post.created_at)+'</p>'
                            +'<p class="text-right">点击'+obj.post.click_num+'</p>'
                          +'</div>'
                      +'</div>';
            $(".post-info").append(HTML);
            if(obj.comments.length>0){
                var items = [];
                $.each(obj.comments,function(idx,comment){
                    var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8">'
                    +'<div class="post" '+'data-id="'+(idx+1)+'">'
                    +'<p class="text-left info">'
                    +'#'+(idx+1)
                    +'</p><p class="text-left">'
                    +html_escape(comment.comment)
                    +'</p><p class="text-right">'
                    +html_escape(comment.author)
                    +'</p><p class="text-right">'
                    +pretty_date(comment.created_at)
                    +'</p>'
                    +'</div></div><div class="col-md-2"></div></div>';
                    items.push(HTML);
                    max_data_id=idx+1;
                });
                $(".post-list").prepend(items.reverse().join(""));
                set_color();
            }
            else{
                var HTML = '<div class="row">'
                            +'<div class="col-md-2"></div>'
                            +'<div class="col-md-8">'
                                +'<div class="transparent">'
                                    +'<div class="inner" style="text-align:center">'
                                        +'<span style="color:rgba(0,0,0,0,25);">目前尚无评论</span>'
                                    +'</div>'
                                +'</div>'
                            +'</div>'
                            +'<div class="col-md-2">'
                            +'</div>'
                            +'</div>';
                $(".post-list").prepend(HTML);
            }
        }
        else{
            return;
        }

    });
}
$(function() {
    //设置顶部滚动文字
    set_scroll_notification();
    //添加回到顶部按钮
    back_to_top();
    var url = window.location.href;
    var url_parts = url.split('/');
    var post_id = url_parts[url_parts.length-1];
    load_comment_post(post_id);

    max_data_id = 0;

    $("#submit_btn").click(function() {
        var comment = $("#content").val();
        var author = $("#nickname").val();
        var ts = Date.parse(new Date()); 

        $.post("/api/post",{
            _xsrf: getCookie("_xsrf"),
            kind: "comment",
            comment: comment,
            author: author,
            reply_to: post_id,
        },function (data,textStatus) {
            var obj = data;
            if(obj.statusCode==200){
                var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8">'
                    +'<div class="post" '+'data-id="'+(max_data_id+1)+'">'
                    +'<p class="text-left info">'
                    +'#'+(max_data_id+1)
                    +'</p><p class="text-left">'
                    +html_escape(comment)
                    +'</p><p class="text-right">'
                    +html_escape(obj.author)
                    +'</p><p class="text-right">'
                    +pretty_date(ts)
                    +'</p>'
                    +'</div></div><div class="col-md-2"></div></div>';
                $(".post-list").html("");
                $(".post-list").prepend(HTML);
                set_color();
                //这里需要提示用户发送成功
                layer.msg('评论成功', 2, -1);
                $("#content").val("");
            }
            else{
                layer.msg('评论失败', 2, -1);
            }
        });
        return false;
    });
});