// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Block extends Entity
{
    constructor( game, name, data, collisionel )
    {
        super( game, name, 'game', data );

        this.collisionel = collisionel;

        this.active = true;

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

    /**
     * Remove entities from mapTempalte
     */
    remove()
    {
        tools.tabRemoveEl( this.game.mapTemplate.getTabEntities(), this );

        return;
    }

    isActive()
    {
        return this.active;
    }

    disable()
    {
        this.active = false;

        return;
    }

}

module.exports = Block;