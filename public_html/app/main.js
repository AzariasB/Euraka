// Data
var config = require( "data/config.js" );

// Lib
var tools = require( "lib/tools.js" );

// Class
var Preloader = require( "class/preloader.js" );
// Controllers
var GameController = require( "controllers/gameController.js" );

// Views
var IntroTemplate = require( "templates/introTemplate.js" );
// var IntroView = require( "tempaltes/introView.js" );

for ( var k = [ "       /|________________\n", "O|===|* >________________> Euraka - Fancy Tree Studio \n", "       \\|\n", "\n www.thegamehasbegun.com" ], g = 0; 4 > g; g++ );
console.log.apply( console, k );

// Contient tous les objets pour être paratagé entre les classes
var game = {};

// Préload les images et les sons
game.preloader = new Preloader( game );
game.preloader.start();


// Lancement du jeu
game.gameController  = new GameController( game );
// Intro et menu du jeu
game.introTemplate  = new IntroTemplate( game );
game.introTemplate.start();