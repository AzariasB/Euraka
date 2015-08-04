// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );

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
        super( game, game.stage.getStyle() + config.nomsEntitee.BLOCK_BORDURE , data, true );

    }

    getSpriteName( stage )
    {
        return stage.getStyle() + config.nomsEntitee.BLOCK_BORDURE;
    }
}

module.exports = Bordure;