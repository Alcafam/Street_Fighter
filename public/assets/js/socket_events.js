$(document).ready(function(){
    const socket = io();

    // This snippet opens modal when New Connection is made
    socket.on('new_connection', function (){
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
            $('#arena_form').submit();
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
    })

    socket.on('frontend_set_player', function (player_num){
        player = player_num;
        $('#'+player_num+'_pick').text(player_num);
    })

})