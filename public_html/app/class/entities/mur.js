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

        //Changer le nom du sprite
        super( game, this.getSpriteName( game.stage ), data, true );
    }

    getSpriteName( stage )
    {
        var alternatives;

        // 1 skin pour la préhistoire
        if ( stage.getStyle() === 'prehi_' )
        {
            alternatives = [1];
        }
        // 3 skins
        else
        {
            alternatives = _.range( 1, 4 );
        }

        return stage.getStyle() + config.nomsEntitee.BLOCK_MUR + '0' + tools.tabRandom( alternatives );
    }
}

module.exports = Mur;