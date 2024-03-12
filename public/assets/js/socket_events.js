$(document).ready(function(){
    const socket = io();

    // This snippet opens modal when New Connection is made
    socket.on('new_connection', function (){
        $('#selection').attr('hidden',false)
        $('#arena').attr('hidden',true)
        socket.emit('new_user');
    });

    // 
    socket.on('2_players_only', function (){
        $('#new_connection_modal').modal('hide');
        $('#sorry_modal').modal({backdrop: 'static', keyboard: false})  
        $('#sorry_modal').modal('show');
    });
    
    // Waiting room
    socket.on('waiting_room', function (){ 
        $('#new_connection_modal').modal('show');
    })

    // When both player enter, the conter starts
    socket.on('all_players_entered', function(){
        $('#new_connection_modal').modal('hide');
        $('#new_connection_modal').modal({backdrop: 'static', keyboard: false}) 
        select_timer(3)
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

    socket.on('frontend_setup',function(){
        socket.emit('setup_arena');
    })

    socket.on('start_fight', function(data){
        console.log(data)
        $('#selection').attr('hidden',true)
        $('#arena').attr('hidden',false)
        $('body').css('background', 'url("./assets/images/' + data.arena + '.gif")no-repeat fixed center');
        $('body').css('background-size', 'cover');

        setup_player(data.player_1);
        setup_player(data.player_2);
    })

    $(document).on('keydown', function(e) {
        if(direction){
            count = counter(count)
            if (e.keyCode == 65) { // LEFT
                if(left>0){
                    left = left - 10;
                    picture = direction+'_'+count+'.png'
                }                
                update_left_right();
            }
            else if (e.keyCode == 68) { // RIGHT
                if(left<1000){
                    left = left + 10;    
                    picture = direction+'_'+count+'.png'
                }   
                update_left_right(); 
            }
            else if(e.keyCode == 32) { // JUMP
                if(bottom>0){
                    bottom += 60;
                    picture = 'jump_'+direction+'.gif'
                }
                update_jump()
            }
            else if(e.keyCode == 75){ //PUNCH
                picture = 'punch_'+direction+'.gif';
                update_attack()
            }
        }
    })
})