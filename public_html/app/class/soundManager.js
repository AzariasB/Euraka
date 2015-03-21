// Data
var config = require( 'data/config.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class SoundManager
{
    constructor( game )
    {
        this.game = game;

        this.enabled = true;

        this.currentAsset = null;
        this.tabSounds = [];
        this.volumeDefault = 1;
        this.volume = this.volumeDefault;

        this.currentSound = null;
        this.nextSound = null;

        this.isLoaded = false;

        return;
    }

    setCurrentSound( v )
    {
        this.currentSound = v;

        return;
    }

    setNextSound( v )
    {
        this.nextSound = v;

        return;
    }

    load()
    {
        this.isLoaded = true;

        return;
    }

    setTabSound( v )
    {
        this.tabSounds = v;

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

    play()
    {
        if ( this.enabled === true )
        {
            if ( this.isLoaded === false )
            {
                this.load();
            }

            // On bind la transition, changement de musique lorsqu'elle va se finir
            this.bindUpdate();

            // On la lance la musique
            if ( this.hasNextSound() === true )
            {
                this.fadeOutSound( this.currentSound );
                this.fadeInSound( this.nextSound );
                // this.nextSound.play();
            }
            else
            if ( this.hasSound() === true )
            {
                this.fadeInSound( this.currentSound );
                // this.currentSound.play();
            }
        }

        return;
    }

    fadeOut( sound, ended_callback )
    {
        var self = this;

        this.clearFadeIn( this.fadeOutInterval );

        if ( tools.isset( sound ) === true )
        {
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
                    sound.pause();

                    self.clearFadeOut();

                    if ( tools.isset( ended_callback ) === true )
                    {
                        ended_callback( sound );
                    }
                }
            }, 40 );
        }

        return;
    }

    fadeIn( sound )
    {
        var self = this;

        if ( tools.isset( sound ) === true  )
        {
            sound.volume = 0;
            sound.play();
        }

        this.clearFadeIn();

        if ( this.enabled === true && tools.isset( sound ) === true )
        {
            this.fadeInInterval = setInterval( function()
            {
                var step = 0.01,
                    volume = sound.volume + step;

                if ( volume < self.volume - step )
                {
                    sound.volume = volume.toFixed( 2 );
                }
                else
                {
                    sound.volume = self.volume;
                    self.clearFadeIn();
                }
            }, 60 );
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

    fadeOutCurrent()
    {
        this.fadeOut( this.currentSound );

        return;
    }

    fadeOutSound( sound )
    {
        this.fadeOut( sound );

        return;
    }

    fadeInSound( sound )
    {
        this.fadeIn( sound );

        return;
    }
}

module.exports = SoundManager;