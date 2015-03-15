/*jslint es6 :true */
// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Projectile extends Entity
{
    constructor( game, x, y, width, height, direction )
    {
        data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;

        this.orientation = config.orientations.RIGHT;

        super( game, config.nomsEntitee.PROJECTILE + this.orientation, 'spritesheet', data );
    }

    canIDie()
    {
        return this.step >= config.projectile.PORTEE;
    }

}

module.exports = Projectile;
