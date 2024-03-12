    const socket = io();
    let pick = $("#player_default").val();

    function highlight(element){
        element.siblings().removeClass("chosen");
        element.addClass("chosen");
        $('#player_default').val(element.attr('data-animated-img'))
    } 
    function saveSelection(element, name, animated_img){
        $("#player_default").val(animated_img); 		
        $('#pick_name').text(name)		
        $('#fighter').val(name)	
        pick = 	$("#player_default").val();
    }
    async function select_timer(seconds){
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                seconds--;
                if (seconds < 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    document.getElementById('timer').innerText = seconds;
                }
            }, 1000);
        });
    }


    $(document).ready(function(){
        $("#characters > img").hover(
            function() {
                $('#player').children(".picked").attr("src", $(this).attr("data-animated-img"));    
                $('#pick_name').text($(this).attr("name"))
            }, 
            function() {
                $("#player > .picked").attr("src", $("#player_default").val());
                $('#pick_name').text($('.chosen').attr("name"))
            }
        );

        $("#characters > img").click(function(){
            highlight($(this));
            saveSelection($(this), $(this).attr("name"), $(this).attr("data-animated-img"));
        });
    })
