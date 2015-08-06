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

        if ( !this.game.sounds.tirSound )
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
        var block, remove, blockEnemy;

        block = this.getBlock( this.nextPosition( config.map.tileSize / 2 ) );
        blockEnemy = this.getBlockEnemy( this.nextPosition( config.map.tileSize / 2 ) );

        // Si le block peut se détruire
        if ( block  )
        {
            if ( tools.isset( block.isDestruct ))
            {
                // Destruction du block
                block.isDestruct();
                remove = true;
            }
            else
            if ( block.isCollisionel && block.isCollisionel()  )
            {
                remove = true;
            }
        }

        // Si le block peut se détruire
        if ( blockEnemy && blockEnemy !== 0 )
        {
            blockEnemy.die();
            remove = true;
        }

        if ( remove )
        {
            // Suppression du projectile
            this.moving = false;
            tools.tabRemoveEl( this.game.mapTemplate.getTabEntitiesToUpdate(), this );
            tools.tabRemoveEl( this.game.mapTemplate.getTabEntities(), this );
        }

        return;
    }
}

module.exports = Projectile;