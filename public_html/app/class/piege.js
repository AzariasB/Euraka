// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

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
        super(game, config.nomsEntitee.BLOCK_PIEGE ,data,['Piège_fermé','Piege_ouvert'],1, false );
    }
}

module.exports = Piege;
