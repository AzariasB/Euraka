// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );
require( 'lib/mousetrap.js' );

// Template
var AccueilView = require( 'views/intro/accueilTpl.ract' );
var ToucheView = require( 'views/intro/toucheTpl.ract' );
var CreditView = require( 'views/intro/creditTpl.ract' );

class IntroTemplate
{
    constructor( game )
    {
        this.game = game;

        return;
    }

    start()
    {
        tools.populateTemplate( AccueilView, 'l-main', null, this.tplLoaded.bind( this ) );

        return;
    }

    tplLoaded()
    {
        tools.addClick( 'commencer', this.handleCommencer.bind( this ) );
        Mousetrap.bind( 'a', this.handleCommencer.bind( this ), 'keydown' );

        tools.addClick( 'touches', this.handleTouches.bind( this ) );
        tools.addClick( 'credits', this.handleCredits.bind( this ) );
        return;
    }

    handleCommencer()
    {
        this.game.gameController.start();

        return;
    }

    handleTouches()
    {
        this.openPopin(ToucheView);

        return;
    }

    handleCredits()
    {
        this.openPopin(CreditView);

        return;
    }

    openPopin(view)
    {
        tools.addOverlay( function()
        {
            tools.showTemplate( view, 'popin' );
            Mousetrap.bind( 'a', function()
            {
                tools.removeOverlay();
                tools.fadeOut( 'popin' );
            }, 'keydown' );
        } );

        return;
    }
}

module.exports = IntroTemplate;