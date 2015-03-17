// Data
var config = require( 'data/config.js' );

// Class
var Monster = require( 'class/entities/monster.js' );

class Chat extends Monster
{
    constructor( game, x, y )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.chatSize;
        data.height = config.map.chatSize;
        data.speed = config.map.speedMonster;

        super( game, config.nomsEntitee.CHAT, 'game', data );
    }

    makePath()
    {
        var incrX = Math.floor( ( Math.random() * 1 ) - 1 );
        var incrY = Math.floor( ( Math.random() * 1 ) - 1 );
        this.gridX = incrX;
        this.gridY = incrY;
    }

    process()
    {
        if ( this.playerAroundme() )
        {
            followPlayer();
        }
        else
        {
            makePath();
        }
    }

}

module.exports = Chat;