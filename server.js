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
let player_1='';
let player_2='';

// ====== ROUTE ====== //
app.get("/", function (request, response){
	response.render('index');
})
app.get("/arena", function (request, response){
	response.render('arena');
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
            client_ids.push(socket.id) //This would push the socket ids to a variable

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
        if(socket.id==client_ids[0]){
            player_1 = fighter
        }else{
            player_2 = fighter;
        }
        socket.emit('frontend_setup');
    })

    socket.on('setup_arena', function(){
        let arena = backgound[Math.floor(Math.random() * backgound.length)];
        if(socket.id==client_ids[0]){
            io.sockets.emit('start_fight', {
                player_1:{
                    fighter: player_1,
                    number: 1
                },
                player_2:{
                    fighter: player_2,
                    number: 2
                },
                arena:arena
            })
        }
    })

    /*when user disconnects */
    socket.once('disconnect', function (){ 
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
})
console.log('Server is listening on port 8000');