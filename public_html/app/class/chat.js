// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

class Chat extends Monster
{
    constructor(game,x,y,width,height)
    {
        
        var data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;
        
        super(game,config.monstres.CHAT,'chat_file',data);
    }
    
    makePath()
    {
        var incrX = Math.floor((Math.random() * 1)  -1);
        var incrY = Math.floor(Math.random() * 1) -1);
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