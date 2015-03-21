// Data
var config = require( 'data/config.js' );

// Class
var Character = require( 'class/entities/character.js' );
var Stage = require( 'class/stage.js' );
var Entity = require( 'class/entity.js' );
var Timer = require( 'class/timer.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

// Controller
var MapTemplate = require( 'templates/mapTemplate.js' );

class GameController
{
    constructor( game )
    {
        this.game = game;
        this.game.gameView = null;
        this.hasNeverStarted = true;
        this.tabCodeStage = [ 'tuto', 'grotte1-1a', 'grotte1-2a', 'pyramide2-1a', 'pyramide2-2a' ];
        // this.tabCodeStage  = [ 'pyramide1' ];
        this.indexCodeStage = 0;
        this.nbRunTotal = this.tabCodeStage.length;
        this.currentCodeStage = null;

        this.game.stageTime = 0;
        this.game.runTime = 0;
        this.stageTimer = null;
        this.runTimer = null;
        this.resetTimer();

        return;
    }

    getCurrentCodeStage()
    {
        return this.currentCodeStage;
    }

    getStageTimer()
    {
        return this.stageTimer;
    }

    getRunTimer()
    {
        return this.runTimer;
    }

    isEndRun()
    {
        return this.indexCodeStage === this.nbRunTotal;
    }

    tickStageTimer()
    {
        this.game.stageTime = this.game.stageTime + 1;
        this.stageTimer.resume();

        return;
    }

    tickRunTimer()
    {
        console.log('yo');
        this.game.runTime = this.game.runTime + 1;
        this.runTimer.resume();

        return;
    }

    resetTimer()
    {
        this.stageTimer = new Timer( this.tickStageTimer.bind( this ), 1000 );
        this.runTimer = new Timer( this.tickRunTimer.bind( this ), 1000 );

        this.game.stageTime = 0;
        this.game.runTime = 0;

        return;
    }

    startTimers()
    {
        this.runTimer.resume();
        this.stageTimer.resume();

        return;
    }

    stopTimers()
    {
        this.runTimer.pause();
        this.stageTimer.pause();

        return;
    }

    resetRun()
    {
        if ( tools.isset( this.game.character ) === true )
        {
            this.game.character.resetKikette();
        }

        this.resetTimer();
        this.indexCodeStage = 0;
    }

    reRun()
    {
        this.resetRun();
        return this.start();
    }

    cinematique()
    {
        this.hasNeverStarted = false;

        return this.game.gameTemplate.cinematique();
    }

    start()
    {
        this.game.stageTime = 0;

        if ( this.hasNeverStarted === true )
        {
            return this.cinematique();
        }

        // // On instancie la musique après la map
        // this.musicManager = new MusicManager( this.game );
        // this.musicManager.play();
        // this.musicManager.fadeInCurrent();

        // // On instancie l'ambiance après la map
        // this.ambienceManager = new AmbienceManager( this.game );
        // this.ambienceManager.play();
        // this.ambienceManager.fadeInCurrent();

        return this.game.gameTemplate.showGame();
    }

    gameLoaded()
    {
        this.currentCodeStage = this.tabCodeStage[ this.indexCodeStage ];
        this.indexCodeStage = this.indexCodeStage + 1;

        this.game.mapTemplate = new MapTemplate( this.game );

        this.game.stage = new Stage( this.game, this.currentCodeStage );
        this.game.stage.setCallbackInit( this.stageLoaded.bind( this ) );

        this.game.stage.init();

        return;
    }

    stageLoaded()
    {
        var start, character, halo;

        start = this.game.stage.getTabEntree();

        this.game.mapTemplate.setStage( this.game.stage );

        halo = new Entity( this.game, 'halo', 'game',
        {
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0
        } );

        character = new Character( this.game, start[ 0 ], start[ 1 ], config.map.speed );
        character.hasChangeEnergie();

        this.game.character = character;
        this.game.mapTemplate.pushEntityToUpdate( character );
        this.game.mapTemplate.setCharacter( character );
        this.game.mapTemplate.setHalo( halo );

        return this.game.gameTemplate.showMinimap();
    }

    showVictoire()
    {
        this.stopTimers();

        // if ( tools.isset(Storage ) === true )
        // {
        //     localStorage.getItem('higthscore');
        //     localStorage.setItem("lastname", "Smith");
        // }
        // else
        // {
        //     console.log('Sorry! No Web Storage support..');
        // }

        return this.game.gameTemplate.showPopinScoring();
    }

    startNextLvl()
    {
        if ( this.isEndRun() === true )
        {
            this.game.gameTemplate.showPopinScoringTotal();
        }
        else
        {
            this.start();
        }

        return;
    }

    showDeath()
    {
        this.indexCodeStage = 0;

        return this.game.gameView.showDeath();
    }

    updateMusic()
    {
        // this.musicManager.load();

        return;
    }

    updateAmbience()
    {
        // this.ambienceManager.load();
        // this.ambienceManager.update();

        return;
    }
}

module.exports = GameController;