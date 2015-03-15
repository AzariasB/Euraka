// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

/**
 * Un block sol se trouve ... au sol  (lol)
 *  On peut marche dessus sans collisions
 */
class Entree extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.entreeSize;
        data.height = config.map.entreeSize;

        //Changer le nom du sprite
        super(game, config.nomsEntitee.BLOCK_ENTREE ,data,['Prise_avant','Prise_après'],1, true );

    }
}

module.exports = Entree;