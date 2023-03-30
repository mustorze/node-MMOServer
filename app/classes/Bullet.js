class Bullet {
    constructor(parent, angle, x, y, color) {
        this.id = Math.random();
        this.parent = parent;
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.color = color;
        this.toRemove = false;

        /** Calc */
        this.spdX = Math.cos(this.angle / 180 * Math.PI) * 10;
        this.spdY = Math.sin(this.angle / 180 * Math.PI) * 10;
        this.timer = 0;

        initPack.bullets.push(this.initPack);
    }

    update() {
        if (this.timer++ > 30)
            this.toRemove = true;

        for (const i in Players) {
            const victim = Players[i];
            const player = Players.find(item => item.id === this.parent);
            if (this.getDistance(victim) < 32 && player.id !== victim.id) {
                // collision
                victim.hp -= 1;

                if (victim.hp <= 0) {
                    player.score += 1;

                    victim.hp = victim.hpMax;
                    victim.teleport(Math.random() * 500, Math.random() * 500);
                }

                victim.socket.emit('selfUpdate', {hp: victim.hp})
                player.socket.emit('selfUpdate', {score: player.score})

                this.toRemove = true;
            }
        }

        this.move();

        if (this.toRemove) {
            Bullets.splice(Bullets.indexOf(this), 1);
            removePack.bullets.push({id: this.id});
        }
    }

    move() {
        this.x += this.spdX;
        this.y += this.spdY;
    }

    getDistance(pt) {
        return Math.sqrt(Math.pow(this.x - pt.x, 2) + Math.pow(this.y - pt.y, 2));
    }

    get initPack() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            angle: this.angle,
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
}

module.exports = Bullet;