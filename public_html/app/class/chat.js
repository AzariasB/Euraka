// Data
var config = require( 'data/config.js' );

// Class
var Monster = require( 'class/monster.js' );

class Chat extends Monster
{
    constructor(game,x,y,width,height)
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;

        // super(game,config.monstres.CHAT,'spritesheet',data);
        super(game,config.nomsEntitee.BLOCK_KIKETTE,'spritesheet',data);
    }

    makePath()
    {
        var incrX = Math.floor((Math.random() * 1)  -1);
        var incrY = Math.floor((Math.random() * 1) -1);
        this.gridX = incrX;
        this.gridY = incrY;
    }

    process(){
        if(this.playerAroundme()){
            followPlayer();
        }else{
            makePath();
        }
    }

}

module.exports = Chat;