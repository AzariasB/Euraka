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
    constructor( game, x, y, width, height, orientation )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.width = width;
        data.height = height;
        data.speed = config.map.speedProjectile;
        data.orientation = orientation;

        super( game, config.nomsEntitee.PROJECTILE + data.orientation, 'game', data );

        this.portee = config.projectile.PORTEE;

        if ( tools.isset( this.game.sounds.tirSound ) === false )
        {
            var tirSound = this.game.preloader.getAsset( 'sound', 'sons/tir.mp3' );
            this.game.sounds.tirSound = tirSound.getObj();
        }

        this.game.sounds.tirSound.currentTime = 0;
        this.game.sounds.tirSound.play();

        var self = this;
        this.onHasMoved( function()
        {
            self.hasHit();
        } );

        return;
    }

    hasHit()
    {
        var block, remove;

        block = this.getBlock( this.nextPosition( config.map.tileSize / 2 ) );

        // Si le block peut se détruire
        if ( tools.isset( block ) === true )
        {
            if ( tools.isset( block.isDestruct ) === true )
            {
                // Destruction du block
                block.isDestruct();
                remove = true;
            }
            else
            if ( tools.isset( block.isCollisionel ) === true && block.isCollisionel() === true )
            {
                remove = true;
            }

            if ( remove === true )
            {
                // Suppression du projectile
                this.moving = false;
                tools.tabRemoveEl( this.game.mapTemplate.getTabEntitiesToUpdate(), this );
                tools.tabRemoveEl( this.game.mapTemplate.getTabEntities(), this );
            }
        }

        return;
    }
}

module.exports = Projectile;