// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );
var Timer = require( 'class/timer.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Character extends Entity
{
    constructor( game, x, y, speed )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.speed = speed;
        data.width = config.map.characterSize;
        data.height = config.map.characterSize;

        this.orientation = config.orientations.RIGHT;
        this.nbInput = 0;
        this.tabInput = [];
        this.spriteStepStart = 1;
        this.spriteStepEnd = 4;
        this.changeSpriteMax = 20;
        this.changeSprite = this.changeSpriteMax;
        this.spriteStep = this.spriteStepStart;

        super( game, config.nomsEntitee.JOUEUR + this.orientation, 'spritesheet', data );

        this.energy = config.energie.JAUGE_MAX;
        this.rayon_ecl = 1;
        this.dequeEclairage = [];
        this.entityKilled = {};

        return;
    }

    getRayonEcl()
    {
        return this.rayon_ecl;
    }

    hasChangeEnergie()
    {
        // this.game.gameView.set('energieClass', 'energy_0' + this.getEnery());
        this.game.gameView.set('energieClass', 'energy_0' + '1');

        return;
    }


    /**
     * Quand on gagne de l'éngerie, on 'pause' le timer précédent et on lance le suivant
     * C'est un système de pile ... avec des Timers.
     */
    addRayonEclairage()
    {
        var self = this,
            dequeEclairage = {};

        //On perd de l'énergie et s'il en reste, on fait quelque chose
        if ( this.lostEnergy() >= 0 )
        {

            if ( this.rayon_ecl > 1 )
            {
                // Quand il a déjà boosté son niveau d'énergie
                if ( tools.isset( dequeEclairage[ this.rayon_ecl - 1 ] ) === true )
                {
                    dequeEclairage[ this.rayon_ecl - 1 ].pause();
                    dequeEclairage[ this.rayon_ecl - 1 ].addTime( config.eclairage.TEMP_AJOUT );
                }

                this.rayon_ecl++;
                this.timer = new Timer( function()
                {
                    self.rayon_ecl--;
                    dequeEclairage[ self.rayon_ecl - 1 ].resume();
                }, config.eclairage.TEMP_BASE );

                dequeEclairage[ this.rayon_ecl - 1 ] = this.timer;

            }
            else
            { // Quand c'est la première fois qu'il booste son niveau d'énergie;
                this.rayon_ecl++;
                this.timer = new Timer( function()
                {
                    self.rayon_ecl--;
                }, config.eclairage.TEMP_BASE );
                this.timer.addTime( config.eclairage.TEMP_AJOUT );

                dequeEclairage[ 0 ] = this.timer;
            }

            this.hasChangeEnergie();
        }

        return;
    }

    getEnery()
    {
        return energy;
    }

    gainEnergy()
    {
        if ( this.energy < config.energie.JAUGE_MAX )
        {
            this.enery++;
            return energy;
        }
        else
        {
            return -1;
        }
    }

    lostEnergy()
    {
        if ( this.energy <= 0 )
        {
            return -1;
        }
        else
        {
            this.energy--;
            return this.energy;
        }
    }

    /**
     * Interuption du joueur si toutes les touches enfoncé sont relevées
     */
    handlePlayerInputOff( keyinput )
    {
        var index = _.indexOf( this.tabInput, keyinput );

        // Input pas dans le tableau
        if ( index === -1 )
        {
            return;
        }

        delete this.tabInput[ index ];
        this.nbInput = this.nbInput - 1;

        if ( this.nbInput === 0 )
        {
            this.moving = false;
        }

        return;
    }

    handlePlayerInput( keyinput )
    {
        // Input déjà dans le tableau
        if ( _.contains( this.tabInput, keyinput ) === true )
        {
            return;
        }

        // Reset animation
        this.changeSprite = this.changeSpriteMax;

        this.tabInput.push( keyinput );
        this.orientation = keyinput;
        this.moving = true;
        this.nbInput = this.nbInput + 1;

        return;
    }

    move( deplacement )
    {
        // pas plus de 5
        deplacement = Math.min( 5, deplacement );

        if ( this.orientation === config.orientations.LEFT )
        {
            this.x = this.x - deplacement;
        }
        else
        if ( this.orientation === config.orientations.RIGHT )
        {
            this.x = this.x + deplacement;
        }
        else
        if ( this.orientation === config.orientations.UP )
        {
            this.y = this.y - deplacement;
        }
        else
        if ( this.orientation === config.orientations.DOWN )
        {
            this.y = this.y + deplacement;
        }

        this.afterStep();

        if ( tools.isset( this.after_step_callback ) === true )
        {
            this.after_step_callback();
        }

        return;
    }

    afterStep()
    {
        // Update animation tous les x
        if ( this.changeSprite < this.changeSpriteMax )
        {
            this.changeSprite = this.changeSprite + 1;
            return;
        }

        this.changeSprite = 0;
        this.spriteStep = this.spriteStep + 1;

        if ( this.spriteStep > this.spriteStepEnd )
        {
            this.spriteStep = this.spriteStepStart;
        }

        this.code = config.nomsEntitee.JOUEUR + this.orientation + '_' + this.spriteStep;
        this.sprite = this.getSprite();

        return;
    }

    getNumberOfKillFor( monsterName )
    {
        return this.entityKilled[ monsterName ];
    }

    getEntityKilled()
    {
        return this.entityKilled;
    }

    addOneKillFor( monsterNamae )
    {
        //Au cas où le nom du monstre n'est pas bien renseigné, pour ne pas avoir de nullpointerexception ou un truc du genre
        try
        {
            this.entityKilled[ monsterName ]++;
        }
        catch ( ex )
        {
            console.log( "Le nom du monstre qui a été tué n'existe pas ou n'as pas été bien renseigné." );
        }
    }

    initTableauMobs()
    {
        var self = this;
        _.each( config.monstres, function( item, monsterName )
        {
            self.entityKilled[ monsterName ] = 0;
        } );
    }

}

module.exports = Character;