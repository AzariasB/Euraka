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
class Mur extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.blockSize;
        data.height = config.map.blockSize;

        //Changer le nom du sprite
        super( game, this.getSpriteName( game.stage.getCode() ), data, [ 'mur' ], 1, true );
    }

    getSpriteName( codeStage )
    {
        var rand;
        // if ( _.random( 0, 10 ) <= 8 )
        // {
        //     rand = '01';
        // }
        // else
        // {
        //     rand = '02';
        // }

        rand = '01';

        return config.nomsEntitee.BLOCK_MUR + '_' + rand;
    }
}

module.exports = Mur;
