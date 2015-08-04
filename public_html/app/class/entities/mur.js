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
class Mur extends Block
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
                stage.getStyle() + config.nomsEntitee.BLOCK_MUR + '0' +
                tools.tabRandom(
                    stage.getStyle() === 'prehi_' ?
                        [1] :
                        _.range(1,4)
                    )
            , data, true );


        //Changer le nom du sprite
    }

}

module.exports = Mur;