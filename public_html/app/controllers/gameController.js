// Data
var config = require( 'data/config.js' );

// Class
var Character = require( 'class/character.js' );
var Stage = require( 'class/stage.js' );
// var MusicManager = require( 'class/musicManager.js' );
// var AmbienceManager = require( 'class/ambienceManager.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

// Template
var MapTemplate = require( 'templates/mapTemplate.js' );

// View
var GameView = require( 'views/game/gameTpl.ract' );

class GameController
{
    constructor( game )
    {
        this.game = game;

        return;
    }

    start()
    {
        if ( tools.isDebug() === true )
        {
            console.log( 'GameController@init' );
        }

        tools.showTemplate( GameView, 'l-main', null, this.gameLoaded.bind( this ) );

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

    gameLoaded()
    {
        var map, stage;

        map = new MapTemplate( this.game );

        // stage = this.getInitialMap();
        this.game.mapTemplate = map;
        // stage.updateGrid();

        // Set du character en premier, car il faut un x,y pour instancier le pathfinder de la map
        stage = new Stage( this.game, 'tuto' );
        this.game.stage = stage;
        stage.setCallbackInit( this.stageLoaded.bind( this ) );
        map.setStage( stage );

        stage.init();

        return;
    }

    stageLoaded()
    {
        var start, character;

        start = this.game.stage.getTabEntree();

        character = new Character( this.game, start[ 0 ] * config.map.tileSize, start[ 1 ] * config.map.tileSize, config.map.speed );
        this.game.character = character;
        this.game.mapTemplate.pushEntityToUpdate( character );
        this.game.mapTemplate.setCharacter( character );
        this.game.mapTemplate.run();

        return;
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