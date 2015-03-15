// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

class Kikette extends Entity
{
    constructor( game, x, y, speed )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.speed = 0;
        data.width = config.map.kiketteSize;
        data.height = config.map.kiketteSize;

        super( game, config.nomsEntitee.BLOCK_KIKETTE, 'spritesheet', data);

        return;
    }
}

module.exports = Kikette;