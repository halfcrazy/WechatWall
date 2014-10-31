function html_escape(a){
    return a.replace('&', '&amp;', 'g')
            .replace('<', '&lt;', 'g')
            .replace('>', '&gt;', 'g')
            .replace('"', '&quot;', 'g')
            .replace("'", '&#39;', 'g');
}

$(function(){
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
    
    //设置内容背景颜色
    var color_list = ["#FAB5A5","#D1E1C6","#FFFF99","#99CCFF"];
    var myDate = new Date();
    var sec = myDate.getSeconds();
    $.each($(".post"),function(idx,val){
        $(this).css({"background-color":color_list[(sec+idx)%color_list.length]});
    });
    $('select[name="inverse-dropdown"], select[name="inverse-dropdown-optgroup"], select[name="inverse-dropdown-disabled"]').select2({dropdownCssClass: 'select-inverse-dropdown'});
});