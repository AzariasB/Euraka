// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
var Sol = require( 'class/entities/sol.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

/**
 * Un block prise, c'est un peu comme un bloc destructible
 * Il faut juste gérer que le joueur puisse se rechargeer lorsqu'il arrive sur cette prise
 */



class Piege extends Block
{

    constructor( game, x, y, width, heigh )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.blockSize;
        data.height = config.map.blockSize;
        
        super( game, config.nomsEntitee.BLOCK_PIEGE + ( Math.random() <= 0.8 ? '01' : '02'), data, false );

        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );
    }


    isOneshot()
    {
        return true;
    }
}

module.exports = Piege;
