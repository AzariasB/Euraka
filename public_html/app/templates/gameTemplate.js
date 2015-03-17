// Data
var config = require( 'data/config.js' );

// Class

// Lib
require( 'lib/mousetrap.js' );
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

// Views
var GameTpl = require( 'views/game/gameTpl.ract' );
var CinematiqueTpl = require( 'views/game/cinematiqueTpl.ract' );
var CinematiqueGameTpl = require( 'views/game/cinematiqueGameTpl.ract' );
var CinematiqueTplKaode = require( 'views/game/cinematiqueKaodeTpl.ract' );
var ModalTpl = require( 'views/game/modalTpl.ract' );
var ScoringTpl = require( 'views/game/scoringTpl.ract' );
var DeathTpl = require( 'views/game/deathTpl.ract' );

class GameTemplate
{
    constructor( game )
    {
        this.game = game;
        this.ractive = null;

        return;
    }

    getRactive()
    {
        return this.ractive;
    }

    showGame()
    {
        var self = this;

        tools.fadeOut( 'l-main', function()
        {
            self.ractive = tools.populateTemplate( GameTpl, 'l-main',
            {
                'score': 0,
                'timer': '00:00'
            }, self.game.gameController.gameLoaded.bind( self.game.gameController ) );
        } );

        return;
    }

    cinematique()
    {
        var self = this;

        tools.fadeOut( 'l-main', function()
        {
            tools.showTemplate( CinematiqueTpl, 'l-main' );
        } );

        Mousetrap.bind( 'a', this.cinematiqueEnd.bind( this ), 'keydown' );

        return;
    }

    cinematiqueEnd()
    {
        Mousetrap.unbind( 'a' );
        this.game.gameController.start();

        return;
    }

    showMinimap()
    {
        var self = this;

        tools.addOverlay( function()
        {
            tools.showTemplate( ModalTpl, 'popin',
            {
                "code": self.game.gameController.getCurrentCodeStage()
            } );
            tools.fadeIn( 'l-main' );
        } );

        Mousetrap.bind( 'a', this.showMinimapEnd.bind( this ), 'keydown' );

        // Reset
        Mousetrap.bind( 'space', this.game.gameController.rerun.bind( this.game.gameController ), 'keydown' );
        tools.addClick( 'ui-reset-btn', this.game.gameController.rerun.bind( this.game.gameController ) );

        return;
    }

    showMinimapEnd()
    {
        tools.fadeOut( 'popin' );
        tools.empty( 'popin' );
        tools.removeOverlay();
        Mousetrap.unbind( 'a' );

        this.game.mapTemplate.run();
        this.game.mapTemplate.charEvent();
        this.game.gameController.startTimers();

        // En cas d'appuie trop rapide de la part du joueur
        _.delay( function()
        {
            tools.fadeOut( 'popin' );
            tools.empty( 'popin' );
            tools.removeOverlay();
        }, 1000 );

        return;
    }

    showPopinScoring()
    {
        var self = this,
            isEnd = this.game.gameController.isEndRun(),
            fct;

        // Fin de run
        if ( isEnd === true )
        {
            fct = this.showPopinScoringTotal.bind( this );
        }
        // Fin de stage
        else
        {
            fct = this.game.gameController.startNextLvl.bind( this.game.gameController );
        }

        Mousetrap.bind( 'a', fct, 'keydown' );

        tools.addOverlay( function()
        {
            tools.showTemplate( ScoringTpl, 'popin',
            {
                "isHighScore": false,
                "classPopin": 'scoringlevel',
                "end": self.game.scoring.endLevel.bind( self )()
            } );
        } );

        return;
    }

    showDeath()
    {
        tools.fadeOut( 'l-main', function()
        {
            tools.showTemplate( DeathTpl, 'l-main' );
        } );

        Mousetrap.bind( 'a', fct, 'keydown' );

        return;
    }

    showDeathEnd()
    {
        Mousetrap.unbind( 'a' );
        this.game.gameController.start();

        return;
    }

    showPopinScoringTotal()
    {
        var self = this;

        tools.addOverlay( function()
        {
            tools.showTemplate( ScoringTpl, 'popin',
            {
                "isHighScore": false,
                "classPopin": 'scoring_run',
                "end": self.game.scoring.endRun.bind( self )()
            } );
        } );

        this.cinematiqueGame();

        return;
    }

    cinematiqueGame()
    {
        tools.fadeOut( 'l-main', function()
        {
            tools.showTemplate( CinematiqueGameTpl, 'l-main' );
        } );

        Mousetrap.bind( 'a', this.cinematiqueGameEnd.bind( this ), 'keydown' );

        return;
    }

    cinematiqueGameEnd()
    {
        Mousetrap.unbind( 'a' );

        return;
    }

}

module.exports = GameTemplate;