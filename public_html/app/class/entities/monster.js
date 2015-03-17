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
            while ( !this.canMove( 1 ) && i < len - 1 )
            {
                // trouve une oritentaiton non testé
                this.orientation = tools.tabRandom( _.difference( tabOrientations, tabTryOrientation ) );
                // push l orientation dans les orientations testé
                tabTryOrientation.push( this.orientation );
                i = i + 1;
            }
            
        // relance le déplacement
        _.delay( this.tickIa.bind( this ), _.random( 2, 6 ) * 1000 );

        return;
    }

    isNear( character, distance )
    {
        var dx, dy, near = false;

        var hisGrid = tools.getPositionInArray(character.x,character.y);
        
//        console.log("Moi chat : ");console.log(myGrid);
//        console.log("\nLe joueur : ");console.log(hisGrid);
        
        dx = Math.abs( this.x - hisGrid.x );
        dy = Math.abs( this.y - hisGrid.y );

        //console.log(" Distance atendue : " + distance + " -distance trouvée en x : " + dx + " -distance trouvé en y : " + dy);
        if ( dx <= distance && dy <= distance )
        {
            near = true;
        }

        return near;
    }

    lookAtCharacter( character )
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
            this.orientation = config.orientations.UP;
        }
        else
        {
            this.orientation = config.orientations.DOWN;
        }
    }

    lostPlayer()
    {
        this.followingPlayer = false;
        return;
    }

    followCharacter( character )
    {
        var path = this.game.mapTemplate.getPath(this.data, {x:character.x,y:character.y} );
        this.go(path);
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