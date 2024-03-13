const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = app.listen(8000);
const io = require('socket.io')(server);
const public_folder = __dirname + "/public";

//use body parser
app.use(bodyParser.urlencoded({extended: true}));
// this is the line that tells our server to use the "/static" folder for static content
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

let client_ids =[];
let ids=[];
let backgound = ['background1','background2','background3'];

// ====== ROUTE ====== //
app.get("/", function (request, response){
	response.render('index');
})

// ====== END OF ROUTE ====== //
// This function gets the new connection's property, specifically the socket ids
function listSocketsProperty(myProperty){
    let sck = io.sockets.sockets
    const mapIter = sck.entries()
    let result = [];
    while(1){
      let en = mapIter.next().value?.[0]
      if(en) {
        result.push(sck.get(en)[myProperty])
      }else 
        break
    }
    return result;
}

// This function removes socket duplicates from the list of sockets that have entered
function remove_duplicates(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
/* REFRESHER:
    io.sockets.emit = all sockets
    socket.broadcast.emit = all rooms EXCEPT OWN socket
    socket.emit = OWN socket ONLY
*/

// socket events
io.sockets.on('connection', function (socket){
    socket.emit('new_connection');
    
    //max of 2 users only
    socket.on('new_user', function (){
        if(client_ids.length<2){
            if(!client_ids.includes(socket.id)){
                client_ids.push(socket.id) //This would push the socket ids to a variable
            }

            if(client_ids.length == 2){
                io.sockets.emit('all_players_entered');
            }else{
                socket.emit('waiting_room');
            }
        }else{
            socket.emit('2_players_only')
        }
    })

    socket.on('backend_set_player', function(player){
        socket.broadcast.emit('frontend_set_player', player);
    })

    socket.on('setup', function(fighter){  
        let number;
        let arena = backgound[0];      
        if(socket.id==client_ids[0]){
            number = 1
        }else{
            number = 2;
        }
        socket.emit('start_fight', {fighter:fighter, number:number, arena:arena})
        socket.broadcast.emit('broadcast_start_fight', {fighter:fighter, number:number, arena:arena})
    })

    // movements
    socket.on('backend_move_left', function(data){
        socket.emit('move_left', {left:data.left, picture:data.picture});
        socket.broadcast.emit('enemy_move_left', {left:data.left, picture:data.picture});
    })

    socket.on('backend_move_right', function(data){
        socket.emit('move_right', {left:data.left, picture:data.picture});
        socket.broadcast.emit('enemy_move_right', {left:data.left, picture:data.picture});
    })

    socket.on('backend_jump', function(data){
        socket.emit('jump', {bottom:data.bottom, picture:data.picture});
        socket.broadcast.emit('enemy_jump', {bottom:data.bottom, picture:data.picture});
    })

    socket.on('backend_punch', function(picture){
        socket.emit('punch', picture);
        socket.broadcast.emit('enemy_punch', picture);
    })

    socket.on('game_over', function(player){
        let winner;
        if(player = "player_1"){
            winner="Player 1";
        }else{
            winner="Player 2";
        }

        io.sockets.emit('winner', winner);
    })

    /*when user disconnects */
    socket.once('disconnect', function (){ 
        io.sockets.emit('reset_page');
        ids = listSocketsProperty('id');
        ids = remove_duplicates(ids);

        let difference = client_ids.filter(x => !ids.includes(x));

        for(var i in client_ids){
            for(var x in difference){
                if(client_ids[i] == difference[x]){
                    client_ids.splice(i, 1);
                }
            }
        }
        if(client_ids.length == 1){
            io.sockets.emit('waiting_room');
        }
    })

    socket.on('restart', function(){
        io.sockets.emit('reset_page')
    })
})
console.log('Server is listening on port 8000');