// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

/**
 * Un block mur .. c'est comme un block 'bord' mais pas avec les mêmes sprites
 */
class Bordure extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.blockSize;
        data.height = config.map.blockSize;

        //Changer le nom du sprite
        super( game, config.nomsEntitee.BLOCK_BORDURE, data, [ 'mur' ], 1, true );
    }
}

module.exports = Bordure;
