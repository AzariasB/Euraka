// Data
var config = require( 'data/config.js' );

// Class
var MultiSprite = require( 'class/multiSprite.js' );

class Block extends MultiSprite
{

    constructor( game, name, data, spritesArray, currentSprite, collisionel )
    {
        super( game, name, data, spritesArray, currentSprite );

        this.collisionel = collisionel;

        return;
    }

    isCollisionel()
    {
        return this.collisionel;
    }

    setCollision( canCollide )
    {
        this.collisionel = canCollide;
    }

}

module.exports = Block;