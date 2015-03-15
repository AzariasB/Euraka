// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

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

        //Changer le nom du sprite
        super( game, this.getSpriteName( game.stage.getCode() ), data, [ 'Piège_fermé', 'Piege_ouvert' ], 1, false );
    }

    getSpriteName( codeStage )
    {
        var rand;
        if ( _.random( 0, 10 ) <= 8 )
        {
            rand = '01';
        }
        else
        {
            rand = '02';
        }

        return config.nomsEntitee.BLOCK_PIEGE + '_' + rand;
    }
}

module.exports = Piege;
