// Data
var config = require( '../data/config.js' );

// Class
var Tuile = require( './tuile.js' );
var SoundManager = require( './soundManager.js' );

// Lib
var tools = require( '../lib/tools.js' );
var _ = require( 'underscore' );

class AmbienceManager extends SoundManager
{
    constructor( game )
    {
        super( game );

        return;
    }

    rand()
    {
        var ambience, ambienceObj;
        this.nextSound = null;

        if ( this.hasTabSound() === true && this.enabled === true )
        {
            ambience = tools.tabRandom( this.tabSounds );
            this.currentAsset = this.game.preloader.getAsset( 'sound', ambience );

            if ( tools.isset( this.currentAsset ) === true )
            {
                ambienceObj = this.currentAsset.getObj();
                ambienceObj.volume = 0;
                ambienceObj.currentTime = _.random( 0, ambienceObj.duration );

                // Son en cours, on prépare le suivant
                if ( this.hasSound() === true )
                {
                    this.nextSound = ambienceObj;
                }
                // Premier son
                else
                {
                    this.currentSound = ambienceObj;
                }
            }
        }

        super.rand();

        return;
    }

    getTimeoutDelay()
    {
        var result;

        if ( this.hasNextSound() )
        {
            result = this.nextSound.duration - this.nextSound.currentTime;
        }
        else
        {
            result = this.currentSound.duration - this.currentSound.currentTime;
        }

        return _.random( config.map.music.timeBeforeEndTransition, result - config.map.music.timeBeforeEndTransition );
    }

    fadeInCurrent()
    {
        this.fadeIn( this.currentSound );

        return;
    }
}

module.exports = AmbienceManager;