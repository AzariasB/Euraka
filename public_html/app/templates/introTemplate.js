// // Data
// var config = require( '../data/config.js' );
// var terrainTypeData = require( '../data/terrainTypeData.js' );
// var archetypeData = require( '../data/archetypeData.js' );

// // Class
// var Start = require( '../class/start.js' );

// // Lib
// var $ = require( 'jquery' );
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );
// var Velocity = require( 'velocity-animate/velocity.js' );
// require( 'velocity-animate/velocity.ui.js' );

// var i18n = require( 'lib/i18n.js' );
// var easing = require( 'lib/jquery.easing.js' );
// var tools = require( 'lib/tools.js' );
// var booklet = require( 'lib/jquery.booklet.js' );

// Template
var AccueilView = require( 'views/game/accueilTpl.ract' );

class IntroTemplate
{
    constructor( game )
    {
        this.game = game;

        return;
    }

    start()
    {
        tools.showTemplate( AccueilView, 'l-main', null, this.tplLoaded.bind( this ) );

        return;
    }

    tplLoaded()
    {
        tools.addClick( 'commencer', this.handleCommencer.bind( this ) );
    }

    handleCommencer()
    {
        this.game.gameController.start();
    }
}

module.exports = IntroTemplate;