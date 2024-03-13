$(document).ready(function(){
    const socket = io();
    var fighter;
    var enemy;
    // This snippet opens modal when New Connection is made
    socket.on('new_connection', function (){
        $('#selection').attr('hidden',false)
        $('#arena').attr('hidden',true)
        socket.emit('new_user');
    });

    // 
    socket.on('2_players_only', function (){
        $('#game_modal').modal('hide');
        $('#sorry_modal').modal({backdrop: 'static', keyboard: false})  
        $('#sorry_modal').modal('show');
    });
    
    // Waiting room
    socket.on('waiting_room', function (){ 
        $('.modal-body').empty();
        $('.modal-body').prepend('<h1>Hello Player 1! <br>Waiting for Opponent...</h1>');
        $('#game_modal').modal({backdrop: 'static', keyboard: false})  
        $('#game_modal').modal('show');
    })

    // When both player enter, the conter starts
    socket.on('all_players_entered', function(){
        add_music('./assets/sounds/player_select.mp3')
            .then(() => {
                $('#background_music').get(0).play();
            })
            .catch((error) => {
                console.error('An error occurred:', error);
            });
        $('#game_modal').modal('hide');
        $('#game_modal').modal({backdrop: 'static', keyboard: false}) 
        select_timer(5)
        .then(() => {
            document.getElementById('timer').innerText = 'Time\'s up!';
            socket.emit('setup',$('#fighter').val())
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
    })

    socket.on('frontend_set_player', function (player_num){
        player = player_num;
        $('#'+player_num+'_pick').text(player_num);
    })

    socket.on('start_fight', function(data){
        $('#selection').attr('hidden',true)
        $('#arena').attr('hidden',false)
        $('body').css('background', 'url("./assets/images/' + data.arena + '.gif")no-repeat fixed center');
        $('body').css('background-size', 'cover');
        fighter = new Character(data);
        fighter.setup_player();
    })

    socket.on('broadcast_start_fight', function(data){
        enemy = new Character(data);
        enemy.setup_player();
    })

    socket.on('reset_page', function(){
        $('#game_modal').modal('hide');
        $('#arena').empty();
        $('#selection').attr('hidden',false);
        $('#arena').attr('hidden',true);
        $('.modal-body').empty();
        $('#audio_area').empty();
        $('#timer').empty();
        $("#player_default").val('./assets/images/ryu_move.gif')
        pick='./assets/images/ryu_move.gif';
        fighter=null;
        enemy=null;
        location.reload();
    })

    socket.on('move_left', function(data){
        fighter.left = data.left - 10;
        fighter.picture = data.picture;
        fighter.update_left_right();
    })
    socket.on('enemy_move_left', function(data){
        enemy.left = data.left - 10;
        enemy.picture = data.picture;
        enemy.update_left_right();
    })

    socket.on('move_right', function(data){
        fighter.left = data.left + 10;
        fighter.picture = data.picture;
        fighter.update_left_right();
    })
    socket.on('enemy_move_right', function(data){
        enemy.left = data.left + 10;
        enemy.picture = data.picture;
        enemy.update_left_right();
    })

    socket.on('jump', function(data){
        fighter.bottom = data.bottom + 80;
        fighter.picture = data.picture;
        fighter.update_jump();
    })
    socket.on('enemy_jump', function(data){
        enemy.bottom = data.bottom + 80;
        enemy.picture = data.picture;
        enemy.update_jump();
    })

    socket.on('punch', function(picture){
        fighter.picture = picture;
        enemy.score=fighter.update_punch(enemy);
        if(enemy.score <= 0){
            socket.emit('game_over', fighter.player_num)
        }
    })
    socket.on('enemy_punch', function(picture){
        enemy.picture = picture;
        fighter.score=enemy.update_punch(fighter);
        if(fighter.score <= 0){
            socket.emit('game_over', enemy.player_num)
        }
    })

    socket.on('winner', function(winner){
        $('.modal-body').empty();
        $('.modal-body').prepend('<h1>GAME OVER <br> WINNER <br>'+ winner+'</h1>');
        $('.modal-body').append('<button id="restart_game" class="btn btn-success">Play Again</button>');
        $('#game_modal').modal({backdrop: 'static', keyboard: false}) 
        $('#game_modal').modal('show');
    })


// EVENT LISTENERS
    $(document).on('keydown', function(e) {
        if(fighter.direction){
            fighter.count = fighter.counter(fighter.count);
            if (e.keyCode == 65) { // LEFT
                if(fighter.left>0){
                    socket.emit('backend_move_left', {left:fighter.left,picture:fighter.direction+'_'+fighter.count+'.png'})
                }       
            }
            else if (e.keyCode == 68) { // RIGHT
                if(fighter.left<1600){
                    socket.emit('backend_move_right', {left:fighter.left,picture:fighter.direction+'_'+fighter.count+'.png'})
                }   
            }
            else if(e.keyCode == 32) { // JUMP
                if(fighter.bottom>0){
                    socket.emit('backend_jump', {bottom:fighter.bottom,picture:'jump_'+fighter.direction+'.gif'})
                }
            }
            else if(e.keyCode == 75){ //PUNCH
                socket.emit('backend_punch', 'punch_'+fighter.direction+'.gif')
            }
        }
    })

    $(document).on('click', '#restart_game', function(){
        socket.emit('restart');
    })
})