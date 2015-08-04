// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );

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

        
        var stage = game.stage;
        super( game,
            stage.getStyle() + config.nomsEntitee.BLOCK_SOL + '_0' + tools.tabRandom(
                stage.getStyle() === 'prehi_' ?
                    _.range(1,4) :
                    _.range(1,3)
                ) ,
            data, false );

        //Changer le nom du sprite
    }

}

module.exports = Sol;