// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );

/**
 * Un block prise, c'est un peu comme un bloc destructible
 * Il faut juste gérer que le joueur puisse se rechargeer lorsqu'il arrive sur cette prise
 */
class Prise extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.priseSize;
        data.height = config.map.priseSize;

        super( game, config.nomsEntitee.BLOCK_PRISE, data, false );
    }
}

module.exports = Prise;
