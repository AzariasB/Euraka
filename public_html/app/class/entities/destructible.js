// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );

/**
 * Un block destructible, c'est un peu plus complexe :
 * Au début, il est infranchissable, mais on peut le détruire. Il est visible sur la carte
 * Lorsqu'on le détruit, il n'y a plus de sprite visible et on peut franchir le bloc
 */
class Destructible extends Block
{
    constructor( game, name, data, collisionel )
    {
        // Changer le nom du sprite
        super( game, name, data, collisionel );

        return;
    }

    isDestruct()
    {

        this.setCollision( false );
        this.setCurrentSprite( getCurrentSprite() + 1 );
    }
}

module.exports = Destructible;