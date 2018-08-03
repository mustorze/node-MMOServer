setInterval(function () {
    for (const i in Players) {
        const player = Players[i];
        player.update();

        if (player.updating) {
            updatePack.players.push({
                id: player.id,
                x: player.x,
                y: player.y
            });

            player.updating = false;
        }
    }

    for (const i in Bullets) {
        const bullet = Bullets[i];
        bullet.update();
    }

    // sending
    for (const i in Players) {
        const player = Players[i];

        player.socket.emit('bigPack', {
            init: initPack,
            update: updatePack,
            remove: removePack
        });
    }

    initPack = {players: [], bullets: []};
    updatePack = {players: [], bullets: []};
    removePack = {players: [], bullets: []};

}, 1000/25);