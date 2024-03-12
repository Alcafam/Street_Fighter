$(document).ready(function(){
    function highlight(element){
        element.siblings().removeClass("chosen");
        element.addClass("chosen");
    }
    function saveSelection(element, name, animated_img){
        var user = element.parent().parent().attr("id"); 	
        $("#"+user+"_default").val(animated_img); 		
        $("span#"+user+"_name").text(name); 				
    }
    $("nav > img").hover(
        function() {	
            $(this).parent().siblings(".picked").attr("src", $(this).attr("data-animated-img"));    
        }, 
        function() {
            var user = $(this).parent().parent().attr("id");       
            $("#"+user+" > .picked").attr("src", $("#"+user+"_default").val());
        }
    );
    $("nav > img").click(function(){
        highlight($(this));
        saveSelection($(this), $(this).attr("name"), $(this).attr("data-animated-img"));
    });
    $("button").click(function(){
        var character1 = $("#user1_name").text();
        var character2 = $("#user2_name").text();
        alert("Battle begins with "+character1+" and "+character2+"!");
    });
})