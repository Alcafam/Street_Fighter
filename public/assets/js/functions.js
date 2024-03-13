class Character{
    constructor(player){
        if(player.number == 1){
            this.direction = "right";
            this.left=20;
            this.bottom=50;
        }else{
            this.direction = "left";
            this.left=1600;
            this.bottom=50;
        }
        this.folder = player.fighter;
        this.player_num = 'player_'+player.number;;
        this.count =1;
        this.picture='';
        this.score = 100;
    }

    setup_player(){
        $('#audio_area').empty();
        this.add_music('./assets/sounds/Arena.mp3')
            .then(() => {
                $('#background_music').get(0).play();
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        $('#score_board').attr('hidden', false)
        $('#'+this.player_num+'_icon').append("<img src='./assets/images/"+this.folder+"/portrait.png' style='height: 100%; width:50px'></img>");
        $('#arena').append(
            "<img id='"+this.player_num+"' src='./assets/images/"+this.folder+"/stand_"+this.direction+".gif' style='position:absolute; bottom:"+this.bottom+"px; left:"+this.left+"px; max-width: 100%; max-height:300px;'></img>"
        );
    }

    update_left_right(){
        $('#'+this.player_num).css('left',this.left+'px');
        $('#'+this.player_num).attr('src','../assets/images/'+this.folder+'/'+this.picture);
        this.default_image(100)
            .then(() => {
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }

    update_punch(opponent){
        $('#'+this.player_num).attr('src','../assets/images/'+this.folder+'/'+this.picture);
        this.default_image(400)
            .then(() => {
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });

        console.log('You: '+this.left);
        console.log('Enemy: '+ opponent.left);
        if(this.left-opponent.left <= 200 && this.left-opponent.left >= -200){
            let opponent_score = opponent.score-10;
            console.log("Score: ");
            console.log("Player1: ",(this.score), " Player2: ",(opponent_score))
            this.update_score(opponent)
                .then(() => {
                })
                .catch((error) => {
                    console.error('An error occurred:', error);
                });
            return opponent_score;
        }else{
            return opponent.score;
        }
    }
    update_jump(){
        $('#'+this.player_num).css('bottom',this.bottom+'px');
        $('#'+this.player_num).css('maxHeight','100%');
        $('#'+this.player_num).css('maxWidth','300px');
        $('#'+this.player_num).attr('src','./assets/images/'+this.folder+'/'+this.picture);
        this.default_image(200)
            .then(() => {
                this.bottom = 50;
                $('#'+this.player_num).css('bottom', this.bottom+'px');
                $('#'+this.player_num).css('maxHeight','300px');
                $('#'+this.player_num).css('maxWidth','100%');
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
    }

    counter(x){
        if(x==1){
            x=2
        }else{
            x=1
        }
        return x
    }

    async default_image(seconds){
        let sec=1;
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                sec--;
                if (sec < 0) {
                    clearInterval(interval);
                    resolve();
                } else {
                    document.getElementById(this.player_num).src  = './assets/images/'+this.folder+'/stand_'+this.direction+'.gif';
                }
            }, seconds);
        });
    }
    
    async add_music(file){
        return new Promise((resolve, reject) => {
            $('#audio_area').prepend('<audio id="background_music" src="'+file+'" loop="loop"></audio>')
            resolve();
        })        
    }

    async update_score(player){
        return new Promise((resolve, reject) => {
            let score = player.score-10;
            let percent_bar = (score / 100) * 100;
            $('#'+player.player_num+'_score').css('width', percent_bar+'%')
            resolve();
        })        
    }
}
async function add_music(file){
    return new Promise((resolve, reject) => {
        $('#audio_area').prepend('<audio id="background_music" src="'+file+'" loop="loop"></audio>')
        resolve();
    })        
}

    