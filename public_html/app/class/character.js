// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );
var Timer = require( 'class/timer.js' );

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
        this.deplacement = 0;

        super( game, config.nomsEntitee.JOUEUR + this.orientation, 'spritesheet', data );

        this.energy = config.energie.JAUGE_MAX;
        this.rayon_ecl = 1;
        this.dequeEclairage = [];
        this.entityKilled = {};

        return;
    }

    setDeplacement( v )
    {
        this.deplacement = v;

        return;
    }
    

    /**
     * Quand on gagne de l'éngerie, on 'pause' le timer précédent et on lance le suivant
     * C'est un système de pile ... avec des Timers.
     */
    addRayonEclairage()
    {
        var dequeEclairage;

        //On perd de l'énergie et s'il en reste, on fait quelque chose
        if ( this.lostEnergy() >= 0 )
        {

            if ( this.rayon_ecl > 1 )
            { // Quand il a déjà boosté son niveau d'énergie
                dequeEclairage[ rayon_ecl - 1 ].pause();
                dequeEclairage[ rayon_ecl - 1 ].addTime( config.eclairage.TEMP_AJOUT );

                this.rayon_ecl++;
                this.timer = new Timer( function()
                {
                    this.rayon_ecl--;
                    dequeEclairage[ rayon_ecl - 1 ].resume();
                }, config.eclairage.TEMP_BASE );

                dequeEclairage[ rayon_ecl - 1 ] = timer;

            }
            else
            { // Quand c'est la première fois qu'il booste son niveau d'énergie;
                this.rayon_ecl++;
                this.timer = new Timer( function()
                {
                    this.rayon_ecl--;
                }, config.eclairage.TEMP_BASE );
                timer.addTime( config.eclairage.TEMP_AJOUT );

                dequeEclairage[ 0 ] = timer;
            }
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
            return energy;
        }
    }

    handlePlayerInput( keyinput )
    {
        this.moving = true;
        this.orientation = keyinput;
        console.log( this.deplacement );
        if ( this.orientation === config.orientations.LEFT )
        {
            this.x = this.x - this.deplacement;
        }
        else
        if ( this.orientation === config.orientations.RIGHT )
        {
            this.x = this.x + this.deplacement;
        }
        else
        if ( this.orientation === config.orientations.UP )
        {
            this.y = this.y - this.deplacement;
        }
        else
        if ( this.orientation === config.orientations.DOWN )
        {
            this.y = this.y + this.deplacement;
        }
    }
    
    getNumberOfKillFor( monsterName )
    {
        return this.entityKilled[monsterName];
    }
    
    getEntityKilled()
    {
        return this.entityKilled;
    }
    
    addOneKillFor( monsterNamae )
    {
        //Au cas où le nom du monstre n'est pas bien renseigné, pour ne pas avoir de nullpointerexception ou un truc du genre
        try{
           this.entityKilled[monsterName]++; 
        }catch(ex){
            console.log("Le nom du monstre qui a été tué n'existe pas ou n'as pas été bien renseigné.");
        }
    }
    
    initTableauMobs()
    {
        var self = this;
        _.each(config.monstres,function(item,monsterName){
            self.entityKilled[monsterName] = 0;
        });
    }
        
}