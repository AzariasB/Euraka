// Data
var config = require( 'data/config.js' );

// Class
var Asset = require( 'class/asset.js' );

// Lib
var tools = require( 'lib/tools.js' );

class Sound extends Asset
{
    constructor( path )
    {
        this.path = path;
        this.pathBase = config.paths.audio;

        return;
    }

    preload()
    {
        this.obj = new Audio();

        // Si on ne peut pas jouer de mp3, on lance les ogg
        if ( tools.canPlayMP3( this.obj ) === false )
        {
            this.path = this.path.replace( 'mp3', 'ogg' );
        }

        // Chorme 206 pending issue
        this.obj.preload = "auto";
        // this.obj.preload = "none";
        this.obj.src = this.pathBase + this.path;
        this.obj.volume = 0;
        this.obj.play();
        this.obj.pause();
        this.obj.volume = 1;
        // this.obj.currentTime = 0;

        return;
    }

    onLoaded( callback )
    {
        // this.obj.addEventListener( 'canplaythrough', callback, false );
        this.obj.addEventListener( 'canplay', callback, false );
        // this.checkReadyState();

        return;
    }
}

module.exports = Sound;