// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

class Block extends Entity
{
    constructor( game, name, data, collisionel )
    {
        super( game, name, 'game', data );

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