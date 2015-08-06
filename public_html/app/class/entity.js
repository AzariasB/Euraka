// Data
var config = require( 'data/config.js' );

// Class
var Sprite = require( 'class/sprite.js' );
var Transition = require( 'class/transition.js' );
// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Entity
{
    constructor( game, code, file, data ,animation = undefined)
    {
        this.game = game;
        this.code = code; // nom du sprite
        this.file = file; // nom du fichier json

        this.x = data.x;
        this.y = data.y;
        this.moveX = 0;
        this.moveY = 0;
        
        this.animation = animation;

        this.width = data.width;
        this.height = data.height;

        // mouvement
        this.moveSpeed = data.speed ? data.speed : config.map.speed;
        this.moveSpeedDefault = this.moveSpeed;

        this.orientation = tools.isset( data.orientation ) === true ? data.orientation : config.orientations.LEFT;

        this.sprite = this.getSprite();

        this.alive = true;

        return;
    }

    getSprite()
    {
        var imgName = this.code;

        // Si on a une animation, on set le sprite
        if ( tools.isset( this.animation ) === true )
        {
            imgName = this.getCurrentSprite();
        }

        return new Sprite( imgName, this.file, this.game );
    }

    getWidth()
    {
        return this.sprite.getWidth();
    }

    getHeight()
    {
        return this.sprite.getHeight();
    }

    getEndSpriteName()
    {
        return this.orientation + '_' +  this.animation.getCurrentFrame();
    }

    getCurrentSprite()
    {
        return this.code + this.getEndSpriteName();
    }

    getAnimation()
    {
        return this.animation;
    }

    updateSprite()
    {
        // Update de l'image qu'utilise le sprite
        this.sprite.updateImg( this.getCurrentSprite() );

        return;
    }

    getMoveSpeedDefault()
    {
        return this.moveSpeedDefault;
    }

    restorMoveSpeed()
    {
        this.moveSpeed = this.moveSpeedDefault;
        return;
    }

    getMoveSpeed()
    {
        return this.moveSpeed;
    }

    setMoveSpeed( v )
    {
        this.moveSpeed = v;
        return;
    }

    tildeTolerance()
    {
        var result = {
            "x": Math.floor( this.width / 2 ),
            "y": Math.floor( this.height - this.height / 10 )
        };

        return result;
    }

    /**
     * Retourne les coordonnées de la tilde en fonction du déplacement
     */
    getCurrentTilde()
    {
        var tolerance = this.tildeTolerance();

        var result = {
            "x": this.x + Math.floor( ( this.moveX + tolerance.x ) / config.map.tileSize ),
            "y": this.y + Math.floor( ( this.moveY + tolerance.y ) / config.map.tileSize )
        };

        return result;
    }

    /**
     * Position absolue sur la map
     */
    calcAbsPos()
    {
        var result = {
            "x": this.x * config.map.tileSize + this.moveX,
            "y": this.y * config.map.tileSize + this.moveY
        };

        return result;
    }

    /**
     * Position relative à la position du stage
     */
    calcPos()
    {
        var result = this.calcAbsPos();

        // Pas de prise en compte de la position du stage, car 'Character' est centré
        result.x = result.x + this.game.stage.getX();
        result.y = result.y + this.game.stage.getY();

        return result;
    }

    setData( data )
    {
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.moveX = data.moveX || 0;
        this.moveY = data.moveY || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;

        return;
    }

    /**
     * Affiche le sprite
     */
    draw()
    {
        var pos = this.calcPos();

        this.sprite.draw( pos.x, pos.y, this.width, this.height );

        return;
    }

    isMoving()
    {
        return this.moving;
    }

    onHasMoved( callback )
    {
        this.hasmoved_callback = callback;

        return;
    }

    hasMoved()
    {
        if ( _.contains( config.map.ia, this.constructor.name ))
        {
            this.updatePositionOnTiledMap();
        }

        if ( this.hasmoved_callback )
        {
            this.hasmoved_callback( this );
        }
        return;
    }

    isAlive()
    {
        return this.alive;
    }

    //Ben... il est mort, faut détruire l'objet
    die()
    {
        var self = this;

        this.alive = false;
        this.sprite.blink( 120 );

        _.delay( function()
        {
            tools.tabRemoveEl( self.game.mapTemplate.getTabEntitiesToUpdate(), self );
            tools.tabRemoveEl( self.game.mapTemplate.getTabEntities(), self );
            var coord = self.getCurrentTilde();
            if(self.game.mapTemplate.tiledMap[coord.y][coord.x] == self){
                //Effaçage de l'entité sur la carte
                self.game.mapTemplate.tiledMap[coord.y][coord.x] = 0;
            }
        }, 800 );

        return;
    }

    nextPosition( deplacement )
    {
        var pos = this.calcPos(),
            entityMove = _.clone( this );

        entityMove.calcPos = this.calcPos;
        entityMove.calcAbsPos = this.calcAbsPos;
        entityMove.tildeTolerance = this.tildeTolerance;
        entityMove.getCurrentTilde = this.getCurrentTilde;

        if ( entityMove.orientation === config.orientations.LEFT )
        {
            entityMove.moveX = this.moveX - deplacement;
        }
        else
        if ( entityMove.orientation === config.orientations.RIGHT )
        {
            entityMove.moveX = this.moveX + deplacement;
        }
        else
        if ( entityMove.orientation === config.orientations.UP )
        {
            entityMove.moveY = this.moveY - deplacement;
        }
        else
        if ( entityMove.orientation === config.orientations.DOWN )
        {
            entityMove.moveY = this.moveY + deplacement;
        }

        return entityMove;
    }

    canMove( deplacement )
    {
        return this.constructor.name === "Projectile" || !this.isHittingBlock( this.nextPosition( deplacement ) );
    }

    updatePositionOnTiledMap()
    {
        var pos = this.getCurrentTilde(),
            tiledMapEnemy = this.game.mapTemplate.tiledMapEnemy;

        tiledMapEnemy[ pos.y ][ pos.x ] = this;

        return;
    }

    /*
    Récupère la tile (ennemy càd IA) positionné au même endroit que l'entité en question
    */
    getBlockEnemy( entity )
    {
        var pos = entity.getCurrentTilde(),
            tiledMapEnemy, resultEnemy;

        tiledMapEnemy = this.game.mapTemplate.tiledMapEnemy;

        try
        {
            resultEnemy = tiledMapEnemy[ pos.y ][ pos.x ];
        }
        catch ( ex ) // Au cas où les coordonées sont trop grande et ne tiennent pas dans le tableau
        {
            console.error( ex );
        }

        return resultEnemy;
    }

    /*
    Récupère la tile fixe (un bloc solide) positionné au même endroit que l'entité en question
    */
    getBlock( entity )
    {
        var pos = entity.getCurrentTilde(),
            result, tiledMap;

        tiledMap = this.game.mapTemplate.tiledMap;

        try
        {
            result = tiledMap[ pos.y ][ pos.x ];
        }
        catch ( ex )
        {
            console.log( ex );
        }

        return result;
    }

    isHittingBlock( entityMoved )
    {
        var block = this.getBlock( entityMoved ),
            result = false;

        return tools.isset( block ) && tools.isset( block.isCollisionel ) && block.isCollisionel();
    }

}

module.exports = Entity;