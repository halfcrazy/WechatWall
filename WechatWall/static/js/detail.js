$(function() {
    set_scroll_notification();
    var url = window.location.href;
    var url_parts = url.split('/');
    var post_id = url_parts[url_parts.length-1];
    //首次加载内容
    $.getJSON("/api/t/"+post_id, function(data) {
        var obj = data;
        if(obj.statusCode==200){
            console.log(obj);
            var items = [];
            $.each(obj.comments,function(idx,comment){
                //post.category_id,post_id
                var HTML = '<div class="row"><div class="col-md-2"></div><div class="col-md-8"><div class="post">'
                +'<p class="text-left info">'
                +'#'+comment.id
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
        }else{
            return;
        }
        $(".post-list").prepend(items.join(""));
    });
    set_color();
});