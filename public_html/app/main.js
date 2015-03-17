// Data
var config = require( 'data/config.js' );

// Lib
var _ = require( 'underscore' );
var tools = require( 'lib/tools.js' );
require( 'lib/mousetrap.js' );

// Class
var Preloader = require( 'class/preloader.js' );

// Controllers
var GameController = require( 'controllers/gameController.js' );

// Views
var IntroTemplate = require( 'templates/introTemplate.js' );
var GameTemplate = require( 'templates/GameTemplate.js' );

for ( var k = [ '       /| ________________\n', 'O|===|* >________________> Euraka - Fancy Tree Studio \n', '      \\|\n', '\n www.thegamehasbegun.com' ], g = 0; 4 > g; g++ );
console.log.apply( console, k );

// Contient tous les objets pour être paratagé entre les classes
var game = {};

// Préload les images et les sons
game.preloader = new Preloader( game );
game.preloader.start();

// Gestion des écrans du jeu
game.gameTemplate = new GameTemplate( game );
game.mapTemplate = null;
game.introTemplate = new IntroTemplate( game );
// Gestion du fonctionnement du jeu
game.gameController = new GameController( game );

// Démarage du jeu
game.introTemplate.start();

if ( tools.isDebug() === true )
{
    Mousetrap.bind( 'q', function()
    {
        game.gameController.hasNeverStarted = false;

        game.gameTemplate.showGame();
        // delay le temps de créer la map
        _.delay( function()
        {
            game.gameController.start();
            // game.gameTemplate.showPopinEnd();
        }, 1000 );
    }, 'keydown' );
    Mousetrap.bind( 's', function()
    {
        game.mapTemplate.stop();
        game.gameController.showVictoire();
    }, 'keydown' );
}