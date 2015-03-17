// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );
var Transition = require( 'class/transition.js' );
var Animation = require( 'class/animation.js' );
var Sol = require( 'class/entities/sol.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Monster extends Entity
{
    constructor( game, name, file, data )
    {
        // Gestion du déplacement
        this.movement = new Transition();
        // Gestion des sprites animés A FAIRE AVANT getSprite
        this.animation = new Animation( 2 );
        this.animation.setSpeed( 150 );
        this.speed = 100;

        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, data.x, data.y );
        game.stage.pushTabEntities( sol );

        super( game, name, 'game', data );

        this.followingPlayer = false;
        this.target = false;

        return;
    }

    runIa()
    {
        this.moving = true;
        this.tickIa();

        return;
    }

    tickIa()
    {
        var tabTryOrientation = [],
            tabOrientations = _.keys( config.orientations ),
            i = 0,
            len = tabOrientations.length;

        // Tant qu'on ne peut pas bouger, on cherche l'orientation adéquate
        while ( this.canMove( 5 ) === false && i < len - 1 )
        {
            // trouve une oritentaiton non testé
            this.orientation = tools.tabRandom( _.difference( tabOrientations, tabTryOrientation ) );
            // push l orientation dans les orientations testé
            tabTryOrientation.push( this.orientation );
            i = i + 1;
        }

        // this.orientation = config.orientations.LEFT;
        // console.log(this.orientation);

        // relance le déplacement
        _.delay( this.tickIa.bind( this ), _.random( 2, 6 ) * 1000 );

        return;
    }

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