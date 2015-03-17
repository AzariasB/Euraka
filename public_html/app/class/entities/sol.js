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

        //Changer le nom du sprite
        super( game, this.getSpriteName( game.stage ), data, false );
    }

    /**
     * Skin alternatif
     */
    getSpriteName( stage )
    {
        var alternatives;

        // 3 skins pour la préhistoire
        if ( stage.getStyle() === 'prehi_' )
        {
            alternatives = _.range( 1, 4 );
        }
        // 2 skins
        else
        {
            alternatives = _.range( 1, 3 );
        }

        return stage.getStyle() + config.nomsEntitee.BLOCK_SOL + '_0' + tools.tabRandom( alternatives );
    }
}

module.exports = Sol;