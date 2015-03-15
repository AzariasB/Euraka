/*jslint es6 :true */
// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

class Projectile extends Entity
{
    constructor( game, x, y, width, height, direction )
    {
        data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;
    }

    canIDie()
    {
        return this.step >= config.projectile.PORTEE;
    }

}

module.exports = Projectile;
