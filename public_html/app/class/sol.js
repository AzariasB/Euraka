// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

/**
 * Un block sol se trouve ... au sol  (lol)
 *  On peut marche dessus sans collisions
 */
class Sol extends Block
{

    constructor( game, x, y, width, heigh )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.blockSize;
        data.height = config.map.blockSize;

        //Changer le nom du sprite
        super(game, config.nomsEntitee.BLOCK_SOL ,data,['sol'], 1, false );
    }
}

module.exports = Sol;
