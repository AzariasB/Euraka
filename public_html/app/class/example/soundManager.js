// Data
var config = require( '../data/config.js' );

// Class
var Tuile = require( './tuile.js' );

// Lib
var tools = require( '../lib/tools.js' );
var _ = require( 'underscore' );

class SoundManager
{
    constructor( game )
    {
        this.game = game;

        this.enabled = true;

        if ( tools.isLocalhost() === true )
        {
            this.enabled = false;
        }

        this.currentAsset = null;
        this.tabSounds = [];
        this.volumeDefault = 1;
        this.volume = this.volumeDefault;

        this.currentSound = null;
        this.nextSound = null;

        this.isLoaded = false;
        this.isRanded = false;

        return;
    }

    load()
    {
        var idTerrain = this.game.region.getTerrainMusique(),
            tuile;

        this.tabSounds = [];

        if ( tools.isset( idTerrain ) )
        {
            tuile = new Tuile();
            tuile.setIdTerrain( idTerrain );
            this.tabSounds = this.constructor.name === 'AmbienceManager' ? tuile.getAmbiances() : tuile.getMusiques();
        }

        // console.log('Sound in load');
        // console.log(this.tabSounds);

        this.isLoaded = true;

        return;
    }

    hasTabSound()
    {
        return tools.isset( this.tabSounds ) === true && this.tabSounds.length > 0;
    }

    hasSound()
    {
        return this.currentSound !== null;
    }

    hasNextSound()
    {
        return this.nextSound !== null;
    }

    update()
    {
        var self = this;

        this.clearUpdate();

        if ( this.enabled === true )
        {
            // On fadeout la musique
            this.fadeOut( this.currentSound, function()
            {
                self.currentSound = self.nextSound;
            } );
            // Nouvelle musique
            this.rand();
            this.play();
            // On augmente le volume prgressivement
            this.fadeIn( this.nextSound );
        }
    }

    /**
     * Lance une fonction qui fera la transition avec la prochaine musique
     */
    bindUpdate()
    {
        this.updateTimeout = setTimeout( this.update.bind( this ), Math.round( this.getTimeoutDelay() ) * 1000 );
        // this.updateTimeout = setTimeout( this.update.bind( this ), 5000 );

        return;
    }

    rand()
    {
        this.isRanded = true;
    }

    play()
    {
        if ( this.enabled === true )
        {
            if ( this.isLoaded === false )
            {
                this.load();
            }

            if ( this.isRanded === false )
            {
                this.rand();
            }

            // On bind la transition, changement de musique lorsqu'elle va se finir
            this.bindUpdate();

            // On la lance la musique
            if ( this.hasNextSound() === true )
            {
                this.nextSound.play();
            }
            else
            {
                this.currentSound.play();
            }
        }

        return;
    }

    fadeOut( sound, ended_callback )
    {
        var self = this;

        this.clearFadeIn( this.fadeOutInterval );
        this.fadeOutInterval = setInterval( function()
        {
            var step = 0.01,
                volume = sound.volume - step;

            if ( volume >= step )
            {
                sound.volume = volume.toFixed( 2 );
            }
            else
            {
                sound.volume = 0;
                self.clearFadeOut();
                ended_callback( sound );
            }
        }, 100 );

        return;
    }

    fadeIn( sound )
    {
        var self = this;

        this.clearFadeIn();
        if ( this.enabled === true )
        {
            this.fadeInInterval = setInterval( function()
            {
                var step = 0.01,
                    volume = sound.volume + step;

                if ( self.enabled && volume < self.volume - step )
                {
                    sound.volume = volume.toFixed( 2 );
                }
                else
                {
                    sound.volume = self.volume;
                    self.clearFadeIn();
                }
            }, 130 );
        }
        return;
    }

    clearUpdate()
    {
        clearTimeout( this.updateTimeout );

        return;
    }

    makeClearInterval( i )
    {
        clearInterval( i );

        return;
    }

    clearFadeOut()
    {
        this.makeClearInterval( this.fadeOutInterval );

        return;
    }

    clearFadeIn()
    {
        this.makeClearInterval( this.fadeInInterval );

        return;
    }

}

module.exports = SoundManager;