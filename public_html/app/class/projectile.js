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
        var data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;

        this.orientation = config.orientations.RIGHT;
        this.portee = config.projectile.PORTEE;

        super( game, config.nomsEntitee.PROJECTILE + this.orientation, 'spritesheet', data );
    }
    
    avance()
    {
        //console.log(this.portee);
        this.lossPortee( .01 );
    }
    
    lossPortee( loss )
    {
        this.portee -= loss;
    }
    
    getPortee()
    {
        return this.portee;
    }

}

module.exports = Projectile;
