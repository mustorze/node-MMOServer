global.Players = [];
global.Bullets = [];

global.initPack = {players: [], bullets: []};
global.updatePack = {players: [], bullets: []};
global.removePack = {players: [], bullets: []};
global.playersOnline = 0;

require('./app/server');
require('./app/server/gameLoop');