// Data
var config = require( 'data/config.js' );

// Class
var Character = require( 'class/character.js' );
var Stage = require( 'class/stage.js' );
var Entity = require( 'class/entity.js' );
// var MusicManager = require( 'class/musicManager.js' );
// var AmbienceManager = require( 'class/ambienceManager.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );
require( 'lib/mousetrap.js' );

// Template
var MapTemplate = require( 'templates/mapTemplate.js' );

// View
var GameView = require( 'views/game/gameTpl.ract' );
var CinematiqueTpl = require( 'views/game/cinematiqueTpl.ract' );
var CinematiqueGameTpl = require( 'views/game/cinematiqueGameTpl.ract' );
var ModalTpl = require( 'views/game/modalTpl.ract' );
var ScoringTpl = require( 'views/game/scoringTpl.ract' );
var DeathTpl = require( 'views/game/deathTpl.ract' );
var CinematiqueTplKaode = require( 'views/game/cinematiqueKaodeTpl.ract' );

class GameController
{
    constructor( game )
    {
        this.game = game;
        this.game.gameView = null;
        this.game.scoringTimer = 0;
        this.hasNeverStarted = true;
        this.tabCodeStage = [ 'tuto', 'pyramide1' ];
        // this.tabCodeStage = [ 'pyramide1' ];
        this.indexCodeStage = 0;
        this.nbRunTotal = this.tabCodeStage.length - 1;
        this.currentCodeStage = null;

        return;
    }

    rerun()
    {
        this.indexCodeStage = 0;
        return this.start();
    }

    cinematique()
    {
        this.hasNeverStarted = false;
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
        this.start();

        return;
    }

    start()
    {
        var self = this;

        clearTimeout( this.interval );
        this.game.scoringTimer = 0;

        if ( this.hasNeverStarted === true )
        {
            return this.cinematique();
        }

        tools.fadeOut( 'l-main', function()
        {
            self.game.gameView = tools.showTemplate( GameView, 'l-main',
            {
                'score': 2500,
                'timer': '00:00'
            }, self.gameLoaded.bind( self ) );
        } );

        // // On instancie la musique après la map
        // this.musicManager = new MusicManager( this.game );
        // this.musicManager.play();
        // this.musicManager.fadeInCurrent();

        // // On instancie l'ambiance après la map
        // this.ambienceManager = new AmbienceManager( this.game );
        // this.ambienceManager.play();
        // this.ambienceManager.fadeInCurrent();

        return;
    }

    startTimer()
    {
        this.interval = window.setInterval( this.updateTimer.bind( this ), 1000 );
    }

    updateTimer()
    {
        this.game.scoringTimer = this.game.scoringTimer + 1;

        return;
    }

    gameLoaded()
    {
        var map, stage;

        this.currentCodeStage = this.tabCodeStage[ this.indexCodeStage ];
        this.indexCodeStage = this.indexCodeStage + 1;

        map = new MapTemplate( this.game );

        // stage = this.getInitialMap();
        this.game.mapTemplate = map;
        // stage.updateGrid();

        // Set du character en premier, car il faut un x,y pour instancier le pathfinder de la map
        stage = new Stage( this.game, this.currentCodeStage );
        this.game.stage = stage;
        stage.setCallbackInit( this.stageLoaded.bind( this ) );

        stage.init();

        return;
    }

    stageLoaded()
    {
        var start, character, halo;

        start = this.game.stage.getTabEntree();

        this.game.mapTemplate.setStage( this.game.stage );

        halo = new Entity( this.game, 'halo', 'spritesheet',
        {
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0
        } );
        character = new Character( this.game, start[ 0 ] * config.map.tileSize, start[ 1 ] * config.map.tileSize, config.map.speed );
        character.hasChangeEnergie();
        this.game.character = character;
        this.game.mapTemplate.pushEntityToUpdate( character );
        this.game.mapTemplate.setCharacter( character );
        this.game.mapTemplate.setHalo( halo );

        return this.showPopin();
    }

    showPopin()
    {
        var self = this;

        tools.addOverlay( function()
        {
            tools.showTemplate( ModalTpl, 'popin',
            {
                "code": self.currentCodeStage
            } );
        } );

        Mousetrap.bind( 'a', this.showPopinEnd.bind( this ), 'keydown' );

        return;
    }

    showPopinEnd()
    {
        tools.empty( 'popin' );
        tools.removeOverlay();
        Mousetrap.unbind( 'a' );

        this.game.mapTemplate.run();
        this.game.mapTemplate.charEvent();
        this.startTimer();

        setTimeout( function()
        {
            tools.empty( 'popin' );
        }, 1000 );

        return;
    }

    showVictoire()
    {
        clearTimeout( this.interval );
        this.game.mapTemplate.stop();
        this.showPopinScoring();

        return;
    }

    showPopinScoring()
    {
        tools.fadeOut( 'l-main', function()
        {
            tools.showTemplate( CinematiqueTplKaode, 'l-main' );
        } );

        return;

        var self = this,
            isEnd = this.indexCodeStage === this.nbRunTotal,
            fct;
        tools.addOverlay( function()
        {
            tools.showTemplate( ScoringTpl, 'popin',
            {
                "isHighScore": false,
                "isFinal": false,
                "end": self.game.scoring.endLevel.bind( self )()
            } );
        } );

        if ( isEnd === true )
        {
            fct = this.showPopinScoringTotal.bind( this );
        }
        else
        {
            fct = this.showNextLvl.bind( this );
        }

        Mousetrap.bind( 'a', fct, 'keydown' );

        return;
    }

    showNextLvl()
    {
        this.indexCodeStage = this.indexCodeStage + 1;
        this.start();

        return;
    }

    showDeath()
    {
        tools.fadeOut( 'l-main', function()
        {
            self.game.gameView = tools.showTemplate( DeathTpl, 'l-main' );
        } );

        this.indexCodeStage = 0;
        Mousetrap.bind( 'a', fct, 'keydown' );

        return;
    }

    showDeathEnd()
    {
        Mousetrap.unbind( 'a' );
        this.start();

        return;
    }

    showPopinScoringTotal()
    {
        var self = this;
        console.log( self.game.scoring.endRun.bind( self )() );
        tools.addOverlay( function()
        {
            tools.showTemplate( ScoringTpl, 'popin',
            {
                "isHighScore": false,
                "isFinal": true,
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
    }

    cinematiqueGameEnd()
    {
        Mousetrap.unbind( 'a' );
    }

    updateMusic()
    {
        // Si on change de region on reload les musiques
        if ( this.game.stage.isRegion === true && this.game.stage !== this.game.stage.region )
        {
            this.game.stage.region = this.game.map;
            this.musicManager.load();
        }

        return;
    }

    updateAmbience()
    {
        this.ambienceManager.load();
        this.ambienceManager.update();

        return;
    }
}

module.exports = GameController;