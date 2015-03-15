// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

/**
 * Un block prise, c'est un peu comme un bloc destructible
 * Il faut juste gérer que le joueur puisse se rechargeer lorsqu'il arrive sur cette prise
 */
class Prise extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.priseSize;
        data.height = config.map.priseSize;

        //Changer le nom du sprite
        super( game, config.nomsEntitee.BLOCK_PRISE, data, [ 'Prise_avant', 'Prise_après' ], 1, true );
    }

    isDestructed()
    {
        this.setCollision( false );
        this.setCurrentSprite( getCurrentSprite() + 1 );
    }
}

module.exports = Prise;