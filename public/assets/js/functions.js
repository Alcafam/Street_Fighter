var direction;
var folder;
var player_num;
var left;
var bottom;
var count =1;
var picture='';
function setup_player(player){
    folder = player.fighter
    player_num = 'player_'+player.number;
    if(player.number == 1){
        direction = "right";
        left=20;
        bottom=50;
    }else{
        direction = "left";
        left=1600;
        bottom=50;
    }
    $('#arena').append(
        "<img id='"+player_num+"' src='./assets/images/"+folder+"/stand_"+direction+".gif' style='position:absolute; bottom:"+bottom+"px; left:"+left+"px; max-width: 100%; max-height:300px; background-color: aqua;'></img>"
    );
}
    
    function update_left_right(){
        $('#'+player_num).css('left',left+'px');
        $('#'+player_num).attr('src','../assets/images/'+folder+'/'+picture);
        // document.getElementById("character").style.left = left+"px";
        // document.getElementById("character").src  = 'images/blanka/'+picture;
        default_image(100)
            .then(() => {
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }

    function update_attack(){
        $('#'+player_num).attr('src','../assets/images/'+folder+'/'+picture);
        // document.getElementById("character").src  = 'images/blanka/'+picture;
        default_image(400)
            .then(() => {
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }
    function update_jump(){
        $('#'+player_num).css('bottom',bottom+'px');
        $('#'+player_num).css('maxHeight','100%');
        $('#'+player_num).css('maxWidth','300px');
        $('#'+player_num).attr('src','./assets/images/'+folder+'/'+picture);
        // document.getElementById("character").style.top = bottom+"px";
        // document.getElementById("character").style.maxHeight  = '100%';
        // document.getElementById("character").style.maxWidth  = '300px';
        // document.getElementById("character").src  = 'images/blanka/'+picture;
        default_image(250)
            .then(() => {
                bottom += 60;
                $('#'+player_num).css('bottom', bottom+'px');
                $('#'+player_num).css('maxHeight','300px');
                $('#'+player_num).css('maxWidth','100%');
                // document.getElementById("character").style.top = bottom+"px";
                // document.getElementById("character").style.maxHeight  = '300px';
                // document.getElementById("character").style.maxWidth  = '100%';
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }

    function counter(x){
        if(x==1){
            x=2
        }else{
            x=1
        }
        return x
    }

    async function default_image(seconds){
        let sec=1;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                sec--;
                if (sec < 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    document.getElementById(player_num).src  = './assets/images/'+folder+'/stand_'+direction+'.gif';
                }
            }, seconds);
        });
    }

    