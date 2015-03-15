// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

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
        super( game, this.getSpriteName( game.stage.getCode() ), data, [ 'sol' ], 1, false );
    }

    getSpriteName( codeStage )
    {
        var result;

        if ( Math.random() <= 0.9 )
        {
            result = '01';
        }
        else
        {
            result = '02';
        }

        return config.nomsEntitee.BLOCK_SOL + '_' + result;
    }
}

module.exports = Sol;
