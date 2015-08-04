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
var CinematiqueCreditTpl = require( 'views/game/cinematiqueCreditTpl.ract' );
var CinematiqueTplKaode = require( 'views/game/cinematiqueKaodeTpl.ract' );
var MinimapTpl = require( 'views/game/minimapTpl.ract' );
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

        // C'est sale mais pas le temps.........
        var cinematiqueSound = this.game.preloader.getAsset( 'sound', 'musiques/cinematique.mp3' );
        this.game.sounds.cinematique = cinematiqueSound.getObj();
        this.game.soundManager.fadeOutSound( this.game.sounds.currentSound );
        this.game.sounds.currentSound = this.game.sounds.cinematique;
        //Pour écouter une autre musique pendant les tests :-)
        !tools.isDebug() && this.game.soundManager.fadeInSound( this.game.sounds.currentSound );

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

        this.game.soundManager.fadeOutSound( this.game.sounds.currentSound );

        this.game.musicManager.setTabSound( config.map.music.tabDefaultMusics );
        !tools.isDebug() && this.game.musicManager.play();

        this.game.gameController.start();

        return;
    }

    showMinimap()
    {
        var self = this;

        tools.addOverlay( function()
        {
            tools.showTemplate( MinimapTpl, 'popin',
            {
                "code": self.game.gameController.getCurrentCodeStage(),
                "title": self.game.stage.getMinimapTitle()
            } );
            tools.fadeIn( 'l-main' );
        } );

        Mousetrap.bind( 'a', this.showMinimapEnd.bind( this ), 'keydown' );

        // Reset
        Mousetrap.bind( 'space', this.game.gameController.reRun.bind( this.game.gameController ), 'keydown' );
        tools.addClick( 'ui-reset-btn', this.game.gameController.reRun.bind( this.game.gameController ) );

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
        var self = this;

        Mousetrap.bind( 'a', this.game.gameController.startNextLvl.bind( this.game.gameController ), 'keydown' );

        tools.addOverlay( function()
        {
            tools.showTemplate( ScoringTpl, 'popin',
            {
                "isHighScore": false,
                "classPopin": 'scoringlevel',
                "end": self.game.scoring.endLevel.bind( self.game.scoring )()
            } );
        } );

        return;
    }

    showDeath()
    {
        this.game.musicManager.play();
        tools.fadeOut( 'l-main', function()
        {
            tools.showTemplate( DeathTpl, 'l-main' );
        } );

        Mousetrap.bind( 'a', this.game.gameController.reRun.bind( this.game.gameController ), 'keydown' );

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
        tools.populateTemplate( ScoringTpl, 'popin',
        {
            "isHighScore": false,
            "classPopin": 'scoring_run',
            "end": this.game.scoring.endRun.bind( this.game.scoring )()
        } );

        Mousetrap.unbind( 'a' );
        Mousetrap.bind( 'a', this.cinematiqueGame.bind( this ), 'keydown' );

        return;
    }

    cinematiqueGame()
    {
        // C'est sale mais pas le temps.........
        this.game.musicManager.fadeOutCurrent();
        var cinematiqueGameSound = this.game.preloader.getAsset( 'sound', 'musiques/fin.mp3' );
        this.game.sounds.cinematiqueGame = cinematiqueGameSound.getObj();
        this.game.sounds.currentSound = this.game.sounds.cinematiqueGame;
        !tools.isDebug() && this.game.soundManager.fadeInSound( this.game.sounds.currentSound );

        tools.fadeOut( 'l-main', function()
        {
            tools.fadeOut( 'popin' );
            tools.empty( 'popin' );
            tools.removeOverlay( function()
            {
                tools.showTemplate( CinematiqueGameTpl, 'l-main' );
            } );
        } );

        Mousetrap.bind( 'a', this.cinematiqueGameEnd.bind( this ), 'keydown' );

        return;
    }

    cinematiqueGameEnd()
    {
        Mousetrap.unbind( 'a' );

        tools.populateTemplate( CinematiqueCreditTpl, 'l-main' );

        Mousetrap.bind( 'a', this.cinematiqueGameCreditEnd.bind( this ), 'keydown' );

        return;
    }

    cinematiqueGameCreditEnd()
    {
        this.game.introTemplate.start();

        return;
    }

}

module.exports = GameTemplate;