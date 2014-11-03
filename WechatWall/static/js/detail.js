function load_comment_post (post_id) {
    //首次加载内容
    $.getJSON("/api/t/"+post_id, function(data) {
        var obj = data;
        if(obj.statusCode==200){
            console.log(obj);
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

    $("#submit_btn").click(function() {
        $.post("/api/post",{
            _xsrf: getCookie("_xsrf"),
            kind: "comment",
            comment: $("#content").val(),
            author: $("#nickname").val(),
            reply_to: post_id,
        },function (data,textStatus) {
            console.log(data);
        });
        load_comment_post(post_id);// oh, it;s dit
        return false;
    });
});