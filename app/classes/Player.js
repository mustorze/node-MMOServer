import Bullet from './Bullet';

class Player {
    constructor(id, socket) {
        this.id = id;
        this.socket = socket;
        this.playing = false;
        this.updating = false;

        /** data */
        this.spdX = 0;
        this.spdY = 0;
        this.maxSpd = 10;
        this.name = "" + Math.floor(10 * Math.random());
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.pressingAttack = false;
        this.mouseAngle = 0;
        this.x = 50;
        this.y = 50;
        this.hp = 10;
        this.hpMax = 10;
        this.score = 0;
        this.color = Math.floor(Math.random()*16777215).toString(16);

        initPack.players.push(this.initPack);
        this.onConnect();
        console.log('Players: ' + ++playersOnline + ', Color: ' + this.color);
    }

    update() {
        this.updateSpd();
        this.movement();

        if (this.pressingAttack) {
            this.shotBullet();
        }
    }

    shotBullet() {
        const bullet = new Bullet(
            this.id,
            this.mouseAngle,
            this.x,
            this.y,
            this.color
        );

        Bullets.push(bullet);
    }

    updateSpd() {
        if (this.pressingRight)
            this.spdX = this.maxSpd;
        else if (this.pressingLeft)
            this.spdX = -this.maxSpd;
        else
            this.spdX = 0;

        if (this.pressingUp)
            this.spdY = -this.maxSpd;
        else if (this.pressingDown)
            this.spdY = this.maxSpd;
        else
            this.spdY = 0;
    }

    movement() {
        if (this.spdX != 0) {
            this.x += this.spdX;

            if (this.x < 0) {
                this.x = 0;
            }

            if (this.x > 500) {
                this.x = 500;
            }

            this.updating = true;
        }

        if (this.spdY != 0) {
            this.y += this.spdY;

            if (this.y < 0) {
                this.y = 0;
            }

            if (this.y > 500) {
                this.y = 500;
            }

            this.updating = true;
        }
    }

    teleport(x, y) {
        this.x = x;
        this.y = y;
        this.updating = true;
    }

    get initPack() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            number: this.name,
            color: this.color
        };
    }

    get updatePack() {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        };
    }

    get primaryPack() {
        const players = [];
        const bullets = [];

        for (const i in Players) {
            const player = Players[i];

            players.push({
                id: player.id,
                x: player.x,
                y: player.y,
                color: player.color
            })
        }

        for (const i in Bullets) {
            const bullet = Bullets[i];

            bullets.push({
                id: bullet.id,
                x: bullet.x,
                y: bullet.y,
                angle: bullet.angle
            })
        }

        return {
            self: {
                id: this.id
            },
            players: players,
            bullets: bullets
        };
    }

    // Connection Settings
    onConnect() {
        // Const
        var $this = this;

        // Primary Pack
        this.socket.emit('primaryPack', this.primaryPack);

        // Receiving
        this.socket.on('keyPress', function (data) {
            if (data.inputId == 'left')
                $this.pressingLeft = data.state;
            else if (data.inputId == 'right')
                $this.pressingRight = data.state;
            else if (data.inputId == 'up')
                $this.pressingUp = data.state;
            else if (data.inputId == 'down')
                $this.pressingDown = data.state;
            else if (data.inputId == 'attack')
                $this.pressingAttack = data.state;
            else if (data.inputId == 'mouseAngle')
                $this.mouseAngle = data.state;
        });

        this.socket.on('disconnect', function () {
            $this.onDisconnect($this);
        });

        // Sending

    }

    onDisconnect(player) {
        Players.splice(Players.indexOf(player), 1);
        removePack.players.push({id: this.id});
        console.log('Players: ' + --playersOnline);
    }
}

module.exports = Player;