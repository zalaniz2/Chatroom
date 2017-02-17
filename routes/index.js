
var allUserInfo = [];

module.exports = function Route(app, server){

    var io = require('socket.io').listen(server);

    // index route
    app.get('/', function (req, res){
        res.render('index');
    });

    //Socket functions
    io.sockets.on('connection', function(socket){
        console.log("Socket is connected");

        console.log(socket.id)
        var userId = socket.id;

        socket.on("got_new_user", function (data){
            console.log(data)

            var userToAdd = {id: userId, name: data.user};

            allUserInfo.push(userToAdd);
            console.log(allUserInfo);

            socket.broadcast.emit("new_user_announcement", {user_name: data});
            socket.emit("got_user", {user: data});
            io.emit("update_people", {everyone: allUserInfo});
            console.log('data sent back');
        });

        socket.on('disconnect', function(data){
            console.log('disconnection');
            for (var i = 0; i < allUserInfo.length; i++){
                // look for disconnected userId
                if (allUserInfo[i].id == userId){
                    var whoLeft = allUserInfo[i].name;
                    console.log('found disconnected user');
                    allUserInfo.splice(i,1);
                    console.log(allUserInfo)
                }
            }
            io.emit("update_people", {everyone: allUserInfo}); // update who is present
            io.emit("announce_who_left", {left: whoLeft});
        });
        socket.on("user_typed", function (data){
            console.log(data);
            for (var i = 0; i < allUserInfo.length; i++){
                // look for disconnected userId
                if (allUserInfo[i].id == userId){
                    var whoSaid = allUserInfo[i].name;
                    console.log('found who typed');
                    console.log(whoSaid);
                }
            }
            io.emit("update_chat", {chat: data, person: whoSaid}); // update who is present
        });
    });
}
