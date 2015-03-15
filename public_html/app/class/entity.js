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
    constructor( game, code, file, data )
    {
        this.game = game;
        this.code = code; // nom du sprite
        this.file = file; // nom du fichier json

        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.path = null;
        this.step = 0;
        this.movement = new Transition();
        this.moveSpeed = config.map.speed;
        this.moveSpeed = tools.isset( data.speed ) === true ? data.speed : config.map.speed;
        this.moveSpeedDefault = this.moveSpeed;
        this.blockMoveSpeed = false; // set à true, empêche la modif de movespeed des effets
        this.orientation = config.orientations.LEFT;
        this.tuile = null;
        this.sprite = this.getSprite();
        // this.setTuile();

        return;
    }

    getSprite()
    {
        return new Sprite( this.code, this.file, this.game );
    }

    setPath( p )
    {
        this.path = p;
        return;
    }

    setStep( s )
    {
        this.step = s;
        return;
    }

    setTuile()
    {

        return;
    }

    getTuile()
    {
        return this.tuile;
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

    getGridX()
    {
        return this.gridX;
    }

    getGridY()
    {
        return this.gridY;
    }

    /**
     * Converti le x,y en pixel vers un x,y en grid
     * @param {x} : int x pixel
     * @param {y} : int y pixel
     */
    setPositionOnMap()
    {
        var grid = this.game.map.pathfinder.setPositionByPixel( this.x, this.y );
        this.gridX = grid.x;
        this.gridY = grid.y;
        return;
    }

    /**
     * Cf. Pathfinding@setStartPosition
     */
    setStartPosition()
    {
        this.game.map.pathfinder.setStartPosition( this.gridX, this.gridY );
        return;
    }

    calcX()
    {
        return this.x * config.map.tileSize + this.game.stage.getX();
    }

    calcY()
    {
        return this.y * config.map.tileSize + this.game.stage.getY();
    }

    setData(data)
    {
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.width = data.width || 0;
        this.height = data.height || 0;

        return;
    }

    /**
     * Affiche le sprite
     */
    draw()
    {
        // console.log( this.calcX() );
        // console.log( this.calcY() );
        // console.log(this.constructor.name);
        if ( _.contains(['Character','Entity'], this.constructor.name) === true )
        {
            this.sprite.draw( this.x + this.game.stage.getX(), this.y + this.game.stage.getY(), this.width, this.height );
        }
        else
        {
            this.sprite.draw( this.calcX(), this.calcY(), this.width, this.height );
        }
    }

    /**
     * Initialise le chemin de l'entité et lance le mouvement
     */
    go( path )
    {
        this.step = 0;
        this.path = path;
        return this.nextStep();
    }

    /**
     * Stops a moving character.
     */
    stop()
    {
        if ( this.isMoving() )
        {
            this.interrupted = true;
        }

        return;
    }

    updateMovement()
    {
        var p = this.path,
            i = this.step;
        if ( p[ i ][ 0 ] < p[ i - 1 ][ 0 ] )
        {
            // this.walk( config.orientations.LEFT );
            this.orientation = config.orientations.LEFT;
        }
        if ( p[ i ][ 0 ] > p[ i - 1 ][ 0 ] )
        {
            // this.walk( config.orientations.RIGHT );
            this.orientation = config.orientations.RIGHT;
        }
        if ( p[ i ][ 1 ] < p[ i - 1 ][ 1 ] )
        {
            // this.walk( config.orientations.UP );
            this.orientation = config.orientations.UP;
        }
        if ( p[ i ][ 1 ] > p[ i - 1 ][ 1 ] )
        {
            // this.walk( config.orientations.DOWN );
            this.orientation = config.orientations.DOWN;
        }

        return;
    }

    nextStep()
    {
        var stop = false,
            x, y;
        if ( this.isMoving() )
        {
            if ( this.before_step_callback )
            {
                this.before_step_callback();
            }

            this.gridX = this.path[ this.step ][ 0 ];
            this.gridY = this.path[ this.step ][ 1 ];
            this.game.map.pathfinder.setStartPosition( this.gridX, this.gridY );
            // if Character.stop() has been called
            if ( this.interrupted )
            {
                stop = true;
                this.interrupted = false;
            }
            else
            {
                if ( this.hasNextStep() )
                {
                    this.nextGridX = this.path[ this.step + 1 ][ 0 ];
                    this.nextGridY = this.path[ this.step + 1 ][ 1 ];
                }

                if ( this.step_callback )
                {
                    this.step_callback();
                }

                if ( this.hasNextStep() )
                {
                    this.step += 1;
                    this.updateMovement();
                }
                else
                {
                    stop = true;
                }
            }

            this.gridX = this.path[ this.step ][ 0 ];
            this.gridY = this.path[ this.step ][ 1 ];
            this.game.map.pathfinder.setStartPosition( this.gridX, this.gridY );
            // if Character.stop() has been called
            if ( this.interrupted )
            {
                stop = true;
                this.interrupted = false;
            }
            else
            {
                if ( this.hasNextStep() )
                {
                    this.nextGridX = this.path[ this.step + 1 ][ 0 ];
                    this.nextGridY = this.path[ this.step + 1 ][ 1 ];
                }

                if ( this.step_callback )
                {
                    this.step_callback();
                }

                if ( this.hasNextStep() )
                {
                    this.step += 1;
                    this.updateMovement();
                }
                else
                {
                    stop = true;
                }
            }

            if ( this.after_step_callback )
            {
                this.after_step_callback();
            }

            // Path is complete or has been interrupted
            if ( stop )
            {
                this.path = null;
                if ( this.after_step_callback )
                {
                    this.after_step_callback();
                }

                // Path is complete or has been interrupted
                if ( stop )
                {
                    this.path = null;
                    // On rétablie la vitesse du joueur
                    this.restorMoveSpeed();
                    if ( this.stop_pathing_callback )
                    {
                        this.stop_pathing_callback( this.gridX, this.gridY );
                    }
                }
            }

            return;
        }
    }

    onBeforeStep( callback )
    {
        this.before_step_callback = callback;
        return;
    }

    onAfterStep( callback )
    {
        this.after_step_callback = callback;
        return;
    }

    onStep( callback )
    {
        this.step_callback = callback;
        return;
    }

    onRequestPath( callback )
    {
        this.request_path_callback = callback;
        return;
    }

    onStartPathing( callback )
    {
        this.start_pathing_callback = callback;
        return;
    }

    onStopPathing( callback )
    {
        this.stop_pathing_callback = callback;
        return;
    }

    // isMoving()
    // {
    //     return this.path !== null && this.path.length > 0;
    // }
    isMoving()
    {
        return this.moving;
    }

    hasNextStep()
    {
        return this.path !== null && ( this.path.length - 1 > this.step );
    }

    onHasMoved( callback )
    {
        this.hasmoved_callback = callback;
        return;
    }

    hasMoved()
    {
        if ( this.hasmoved_callback )
        {
            this.hasmoved_callback( this );
        }
        return;
    }

    isBlockMoveSpeed()
    {
        return this.blockMoveSpeed;
    }

    isAttacked()
    {
        this.die();
    }

    //Ben... il est mort, faut détruire l'objet
    die()
    {

    }
    
    canMove(){
        var joueurBouge = _.clone(this);
        
        switch(joueurBouge.orientation){
            case config.orientations.UP:
                joueurBouge.y -= config.map.speed;
                break;
            case config.orientations.DOWN :
                joueurBouge.y += config.map.speed;
                break;
            case config.orientations.LEFT :
                joueurBouge.x -= config.map.speed;
                break;
            case config.orientations.RIGHT :
                joueurBouge.x += config.map.speed;
                break;
        }
        
        
        return !this.isHittingBlock( joueurBouge);
    }
    
    isHittingBlock( entityMoved ){
        
        var upLeft = tools.getPositionInArray(entityMoved.x,entityMoved.y);
        console.log(upLeft);
        
//        var downRight = tools.getPositionInArray(entityMoved.x + entityMoved.width,entityMoved.y + entityMoved.height);
//        var tiledMap = this.game.mapTemplate.tiledMap;
//        var collision = false;
//        
//        for(var myY = upLeft.y; myY < downRight.y && !collision ; y++){
//            for(var myX = upLeft.x; myX < downRight.x && !collision ; x++){
//                console.log(tiledMap);
//                if(tiledMap[myY][myX].isCollisionel()){
//                    collision = true;
//                    break
//                }
//            }
//        }
        
        return true;
    }
    
    
}

module.exports = Entity;
