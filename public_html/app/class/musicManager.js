// Data
var config = require( 'data/config.js' );

// Class
var SoundManager = require( 'class/soundManager.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class MusicManager extends SoundManager
{
    constructor( game )
    {
        super( game );

        this.currentSound = null;
        this.nextSound = null;
        this.tabLastMusics = [];
        this.volumeDefault = 0.5;
        this.volume = this.volumeDefault;
        this.defaultMusic = 'musiques/jeu1.mp3';

        return;
    }

    /**
     * Retourne une musique non présente dans les trois dernières jouées, ou false après X tentatives
     * @param {Array} tab tableau de musique
     * @return {Mixed} String : nom de la musique ou False : le tableau ne contient que des sons passé dernièrement
     */
    _checkLastMusic( tab )
    {
        var music = tools.tabRandom( tab ),
            count = 0,
            len = 6,
            contains = _.contains( this.tabLastMusics, music );

        // On cherche des musiques qui ne sont pas passées
        // 3 tentatives avant de prendre une musique par défaut
        while ( contains === true && count < len )
        {
            music = tools.tabRandom( this.tabSounds );
            contains = _.contains( this.tabLastMusics, music );
            count++;
        }

        // console.log('contains : ' + contains);
        // On retourne le nom de la musique, si elle est déjà passé dans les 3 dernière false
        return contains === false ? music : false;
    }

    rand()
    {
        // console.log( '--- rand ---' );
        // console.log( this.tabLastMusics );

        var music = false;
        if ( this.hasTabSound() === true )
        {
            // On récupère la musique
            music = this._checkLastMusic( this.tabSounds );
        }

        // console.log('music : ' + music);
        // Si c'est faux, elle a été joué récément, on récupère une musique par défaut
        if ( music === false )
        {
            music = this.defaultMusic;
        }

        this.currentAsset = this.game.preloader.getAsset( 'sound', music );

        // L'asset est trouvé
        if ( tools.isset( this.currentAsset ) === true )
        {
            music = this.currentAsset.getObj();

            if ( tools.isset( music ) === true )
            {
                music.volume = 0;
                music.currentTime = 0;

                // Son en cours, on prépare le suivant
                if ( this.hasSound() === true )
                {
                    this.nextSound = music;
                    // console.log( this.nextSound.src );
                }
                // Premier son
                else
                {
                    this.currentSound = music;
                }
            }
        }
        // L'asset n'a pas été trouvé
        else
        {
            // this.rand();
        }

        return;
    }

    /**
     * Insert la musique dans le tableau de musiques jouées
     */
    _pushMusic( m )
    {
        if ( tools.isset( m ) === false )
        {
            return;
        }

        this.tabLastMusics.push( m.getPath() );

        // Si on atteind la limite de récurrence de la musique, on vire la première musique déjà jouée
        if ( this.tabLastMusics.length > config.map.music.limitRecurrence )
        {
            this.tabLastMusics = _.drop( this.tabLastMusics, 1 );
        }

        return;
    }

    getTimeoutDelay()
    {
        var result = config.map.music.timeBeforeEndTransition;

        if ( this.hasNextSound() )
        {
            result = this.nextSound.duration;
        }
        else
        if ( tools.isset( this.currentSound ) === true )
        {
            result = this.currentSound.duration;
        }

        return result - config.map.music.timeBeforeEndTransition;
    }

    play()
    {
        // On la pousse dans les musique jouées
        this._pushMusic( this.currentAsset );
        super.play();

        return;
    }

    fadeInCurrent()
    {
        this.fadeIn( this.currentSound );

        return;
    }
}

module.exports = MusicManager;