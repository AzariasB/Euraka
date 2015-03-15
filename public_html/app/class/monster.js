// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Monster extends Entity
{
    constructor( game, name, file, data )
    {
        this.orientation = config.orientations.DOWN;
        super( game, name, 'spritesheet', data );

        this.followingPlayer = false;
        this.target = false;
        return;
    }

    // getSpriteName( codeStage )
    // {
    //     var result;

    //     if ( _.contains(['pyramide1'], codeStage ) === true)
    //     {
    //         result = config.monstres.CHAT;
    //     }

    //     return config.monstres.CHAT + this.orientation;
    // }

    isNear( character, distance )
    {
        var dx, dy, near = false;

        dx = Math.abs( this.gridX - character.gridX );
        dy = Math.abs( this.gridY - character.gridY );

        if ( dx <= distance && dy <= distance )
        {
            near = true;
        }

        return near;
    }

    lookAtCharacter( charcacter )
    {
        if ( this.gridX < character.gridX )
        {
            this.orientation = config.orientations.RIGHT;
        }
        else if ( this.gridX > character.gridX )
        {
            this.orientation = config.orientations.LEFT;
        }
        else if ( this.gridY > character.gridY )
        {
            this.orientation = config.orientation.UP;
        }
        else
        {
            this.orientation = config.orientation.DOWN;
        }
    }

    lostPlayer()
    {
        this.followingPlayer = false;
        return;
    }

    followCharacter( character )
    {
        this.followingPlayer = true;
        return;
    }

    //Tue le joueur en fait ...
    attackCharacter( character )
    {
        character.isAttacked();
    }
}

module.exports = Monster;
