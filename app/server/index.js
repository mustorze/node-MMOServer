import * as classes from '../classes';

var server = require('socket.io')();

server.on('connection', function (client) {
    const player = new classes.Player(client.id, client);
    Players.push(player);

    client.on('disconnect', function () {
        player.onDisconnect();
    });
});

server.listen(5000);
console.log('Server Online!');