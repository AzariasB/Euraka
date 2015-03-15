// Data
var config = require( 'data/config.js' );
var stageData = require( 'data/stageData.js' );
var bitmapData = {
    "tuto": require( 'data/stages/tuto.js' ),
    "pyramide1": require( 'data/stages/pyramide1.js' )
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
var MurEntree = require( 'class/murEntree.js' );
var MurSortie = require( 'class/murSortie.js' );
var Bordure = require( 'class/bordure.js' );
var Chat = require( 'class/chat.js' );

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
        this.nbTuilesLargeur = 0;
        this.nbTuilesHauteur = 0;
        this.code = code; // nom du sprite
        this.file = file; // nom du fichier json
        this.game = game; // Sprite déjà chargé

        this.tabEntities = [];
        this.tabEntree = null;
        this.tabSortie = null;

        this.call_back_init = null;
        

        return;
    }

    getCode()
    {
        return this.code;
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
    
    getNbTuilesLargeur()
    {
        return this.nbTuilesLargeur;
    }
    
    getNbTuilesHauteur()
    {
        return this.nbTuilesHauteur;
    }
    /**
     * Génération de la map
     */
    init()
    {
        console.log("Initialisation");
        
        var b, C, tabToPush, data = bitmapData[ this.code ].data,
            tab = {
                "tabSolPaille": [],
                "tabSolRayon": [],
                "tabSolPiege": [],
                "tabSolKikette": [],
                "tabPiegePaille": [],
                "tabPiegeEnnemi": [],
                "tabSolEnnemi": [],
                "tabEnnemiKikette": []
            };
        
        this.nbTuilesHauteur = bitmapData[ this.code ].data.length;
        
        this.nbTuilesLargeur = bitmapData[this.code].data[0].length;
        
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
                        // Case Mur Entrée
                        C = MurEntree;
                        break;
                    case 3:
                        // Case Mur Sortie
                        C = MurSortie;
                        break;
                    case 4:
                        // Case sol lumineuse entrée
                        C = Entree;
                        this.tabEntree = [ idCol, idLine ];
                        break;
                    case 5:
                        // Case sol lumineuse sortie
                        C = Sortie;
                        this.tabSortie = [ idCol, idLine ];
                        break;
                    case 6:
                        // Case bordure
                        C = Bordure;
                        break;
                    case 7:
                        // paille
                        C = Paille;
                        break;
                    case 8:
                        // ennemi
                        C = Chat;
                        break;
                    case 9:
                        // piege
                        C = Piege;
                        break;
                    case 10:
                        // soleil
                        C = Prise;
                        break;
                    case 11:
                        // kikette
                        C = Kikette;
                        break;
                    case 12:
                        // Sol ou paille
                        tabToPush = 'tabSolPaille';
                        break;
                    case 13:
                        // Sol ou rayon de soleil
                        tabToPush = 'tabSolRayon';
                        break;
                    case 14:
                        // Sol ou piège
                        tabToPush = 'tabSolPiege';
                        break;
                    case 15:
                        // Sol ou kikette
                        tabToPush = 'tabSolKikette';
                        break;
                    case 16:
                        // Piège ou paille
                        tabToPush = 'tabPiegePaille';
                        break;
                    case 17:
                        // Piege ou ennemi
                        tabToPush = 'tabPiegeEnnemi';
                        break;
                    case 18:
                        // Ennemi ou sol
                        tabToPush = 'tabSolEnnemi';
                        break;
                    case 19:
                        // Ennemi ou Kikette
                        tabToPush = 'tabEnnemiKikette';
                        break;
                    default:
                        // mur
                        C = Mur;
                        break;
                }

                if ( tools.isset( tabToPush ) === true )
                {
                    tab[ tabToPush ].push( [ idCol, idLine ] );
                    tabToPush = null;
                }
                else
                {
                    b = new C( this.game, idCol, idLine );
                    this.tabEntities.push( b );
                }

            }, this );
        }, this );

        this.postTraitement( tab );

        return;
    }

    postTraitement( tab )
    {
        var nb, index, b, tabEvenOdd, C, tabTmp, oldIdTraitement, tabToRead, oldTabToRead;

        // Traitement des cases une sur deux
        tabEvenOdd = _.range( 12, 18 );

        _.each( tabEvenOdd, function( idTraitement )
        {
            // si on a une valeur
            if ( tools.isset( stageData[ this.code ][ idTraitement ] ) === true && stageData[ this.code ][ idTraitement ] > 0 )
            {
                // tabPiegeEnnemi cases de merdes
                if ( idTraitement === 16 || idTraitement === 17 )
                {
                    return;
                }

                switch ( idTraitement )
                {
                    case 12:
                        C = Paille;
                        tabToRead = 'tabSolPaille';
                        break;
                    case 13:
                        C = Prise;
                        tabToRead = 'tabSolRayon';
                        break;
                    case 14:
                        C = Piege;
                        tabToRead = 'tabSolPiege';
                        break;
                    case 15:
                        C = Kikette;
                        tabToRead = 'tabSolKikette';
                        break;
                    case 18:
                        C = Chat;
                        tabToRead = 'tabSolEnnemi';
                        break;
                }

                // le nombre
                nb = stageData[ this.code ][ idTraitement ];

                // pour toutes les cases l un ou l autre
                _.each( _.range( nb ), function( i )
                {
                    // chope case au hasard
                    index = Math.floor( Math.random() * tab[ tabToRead ].length );

                    b = new C( this.game, tab[ tabToRead ][ index ][ 0 ], tab[ tabToRead ][ index ][ 1 ] );
                    this.tabEntities.push( b );

                    tab[ tabToRead ].splice( index, 1 );

                }, this );

                // pour toutes les valeurs restantes, c'est du sol
                _.each( tab[ tabToRead ], function( item )
                {
                    b = new Sol( this.game, item[ 0 ], item[ 1 ] );
                    this.tabEntities.push( b );
                }, this );
            }

        }, this );

        tabTmp = [
            {
                "idTraitement": 16,
                "tabToRead": 'tabPiegePaille',
                "block": 'piege'
        },
            {
                "idTraitement": 16,
                "tabToRead": 'tabPiegePaille',
                "block": 'paille'
        },
            {
                "idTraitement": 17,
                "tabToRead": 'tabPiegeEnnemi',
                "block": 'piege'
        },
            {
                "idTraitement": 17,
                "tabToRead": 'tabPiegeEnnemi',
                "block": 'ennemi'
        },
            {
                "idTraitement": 19,
                "tabToRead": 'tabEnnemiKikette',
                "block": 'ennemi'
        },
            {
                "idTraitement": 19,
                "tabToRead": 'tabEnnemiKikette',
                "block": 'kikette'
        }
        ];

        // deux tour par id, sinon du sol
        _.each( tabTmp, function( item )
        {
            if ( tools.isset( stageData[ this.code ][ item.idTraitement ] ) === true && tools.isset( stageData[ this.code ][ item.idTraitement ][ item.block ] ) === true && tools.isset( stageData[ this.code ][ item.idTraitement ][ item.block ] ) === true && stageData[ this.code ][ item.idTraitement ][ item.block ] > 0 )
            {
                // si pas set, premier tour
                if ( tools.isset( oldIdTraitement ) === false )
                {
                    oldIdTraitement = item.idTraitement;
                    oldTabToRead = item.tabToRead;
                }
                // Sinon on test si c'est le mm
                else
                {
                    // si pas le mm, on ajoute les cases sols
                    if ( oldIdTraitement !== item.idTraitement )
                    {
                        // pour toutes les valeurs restantes, c'est du sol
                        _.each( tab[ oldTabToRead ][ oldIdTraitement ], function( item )
                        {
                            b = new Sol( this.game, item[ 0 ], item[ 1 ] );
                            this.tabEntities.push( b );
                        }, this );

                        oldIdTraitement = null;
                    }
                }

                // le nombre
                nb = stageData[ this.code ][ item.idTraitement ][ item.block ];

                // pour toutes les cases l un ou l autre
                _.each( _.range( nb ), function( i )
                {
                    switch ( item.block )
                    {
                        case 'piege':
                            C = Piege;
                            break;
                        case 'ennemi':
                            C = Chat;
                            break;
                        case 'kikette':
                            C = Kikette;
                            break;
                        case 'paille':
                            C = Paille;
                            break;
                        default:
                            C = Sol;
                            break;
                    }

                    if ( tab[ item.tabToRead ].length > 0 )
                    {
                        // chope case au hasard
                        index = Math.floor( Math.random() * tab[ item.tabToRead ].length );

                        b = new C( this.game, tab[ item.tabToRead ][ index ][ 0 ], tab[ item.tabToRead ][ index ][ 1 ] );
                        this.tabEntities.push( b );
                    }

                }, this );

            }

        }, this );

        if ( tools.isset( this.call_back_init ) === true )
        {
            this.call_back_init();
        }

        return;
    }
}

module.exports = Stage;
