// Data
var config = require( 'data/config.js' );
var stageData = require( 'data/stageData.js' );
var bitmapData = {
    "tuto": require( 'data/stages/tuto.js' )
};

// Class
var Sol = require( 'class/sol.js' );
var Prise = require( 'class/prise.js' );
var Piege = require( 'class/piege.js' );
var Mur = require( 'class/mur.js' );
var Entree = require( 'class/entree.js' );
var Sortie = require( 'class/sortie.js' );
var Paille = require( 'class/paille.js' );
var Kikette = require( 'class/kikette.js' );

// lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

/* Block
   ---------------

  // sol
  case '#ffffff':
  $id = 1;
  // Entrée
  case '#b00a0a':
  $id = 2;
  // Sortie
  case '#8b3908':
  $id = 3;
  // rayon solaire
  case '#54cd25':
  $id = 4;
  // paille
  case '#e7eb20':
  $id = 5;
  // bonus kikette
  case '#a7a0a0':
  $id = 6;
  // Wall
  default:
  $id = 0;
  break;

*/

class Stage
{
    constructor( game, code, file )
    {
        this.x = -500;
        this.y = -500;
        this.maxX = stageData.maxX;
        this.maxY = stageData.maxY;
        this.code = code; // nom du sprite
        this.file = file; // nom du fichier json
        this.game = game; // Sprite déjà chargé

        this.tabEntities = [];
        this.tabEntree = null;
        this.tabSortie = null;

        this.call_back_init = null;

        return;
    }

    getX()
    {
        return this.x;
    }

    getY()
    {
        return this.y;
    }

    getMaxX()
    {
        return this.maxX;
    }

    getMaxY()
    {
        return this.maxY;
    }

    setMaxSizeX( v )
    {
        this.maxSizeX = v;

        return;
    }

    setMaxSizeY( v )
    {
        this.maxSizeY = v;

        return;
    }

    setCallbackInit( v )
    {
        this.call_back_init = v;

        return;
    }

    getTabEntities()
    {
        return this.tabEntities;
    }

    getTabEntree()
    {
        return this.tabEntree;
    }

    getTabSortie()
    {
        return this.tabSortie;
    }

    getSprite()
    {
        return new Sprite( this.code, this.file, this.game );
    }

    /**
     * Génération de la map
     */
    init()
    {
        var b, C, data = bitmapData[ this.code ].data;

        _.each( bitmapData[ this.code ].data, function( line, idLine )
        {
            _.each( line, function( col, idCol )
            {
                switch ( col.t )
                {
                    case 1:
                        // sol
                        C = Sol;
                        break;
                    case 2:
                        // Entrée
                        C = Entree;
                        this.tabEntree = [ idCol, idLine ];
                        break;
                    case 3:
                        // Sortie
                        C = Sortie;
                        this.tabSortie = [ idCol, idLine ];
                        break;
                    case 4:
                        // rayon solaire
                        C = Prise;
                        break;
                    case 5:
                        // paille
                        C = Paille;
                        break;
                    case 6:
                        // bonus kikette
                        C = Kikette;
                        break;
                    default:
                        // mur
                        C = Mur;
                        break;
                }

                b = new C( this.game, idCol, idLine );
                this.tabEntities.push( b );

            }, this );
        }, this );

        if ( tools.isset( this.call_back_init ) === true )
        {
            this.call_back_init();
        }

        return;
    }
}


module.exports = Stage;