// Data
var config = require( 'data/config.js' );

// Class
var Stage = require( 'class/stage.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

var intituleScore = config.scoring.INTITULE_AFF;
var valeurScore = config.scoring.INTITULE_VAL;

class Scoring
{
    constructor( game )
    {
        //Pour pouvoir déposer et récupérer des informations
        this.game = game;
        this.game.scoring = this;

        this.levelScore = config.scoring.BEGIN_LEVEL;
        this.totalScore = 2500;

        this.timeOut = null;

        return;
    }

    updateScore()
    {
        var self = this;
        this.timeOut = setTimeout( function()
        {
            self.lossPoints( config.scoring.LOSS_PER_SECOND );
            self.updateScore();
        }, config.scoring.UPDATE_TEMPO );

        return;
    }

    //Si on tue un ennemi ... on gagne un certain nombre de points
    gainPoints( points )
    {
        this.levelScore += points;
        return;
    }

    lossPoints( points )
    {
        this.levelScore -= points;
        return;
    }

    getScore()
    {
        return this.levelScore;
    }

    endLevel()
    {
        //On arrête de décrémenter le score
        clearTimeout( this.timeOut );
        /*
         * Règles de scoring :
         *  +125 par munitions restantes
         *  +400 si kikette en sa possession
         */
        var self = this,
            affichage = [], // Variable dans laquelle on vas stocker chaque point d'affichage
            configBonusMunition = config.scoring.PER_MUNITIONS * 1,
            configBonusKikette = config.scoring.KIKETTE_BONUS * 1,
            bonusMunition, kik, killedElements;

        //Nom de la fonction à changer très probablement => fonction qui permet de savoir le nombre de munitions du joueur
        affichage.push(
        {
            intituleScore: "Points restants",
            valeurScore: self.levelScore
        } );

        bonusMunition = configBonusMunition * this.game.character.getEnergy();

        this.levelScore += bonusMunition;

        kik = this.game.character.hasKikette();

        if ( kik )
        {
            this.levelScore += configBonusKikette;
        }

        affichage.push(
        {
            intituleScore: "Energie restante",
            valeurScore: bonusMunition
        },
        {
            intituleScore: "Kikette récupérée",
            valeurScore: configBonusKikette
        } )

        this.totalScore += this.levelScore;

        killedElements = this.game.character.getEntityKilled();

        _.each( killedElements, function( item, key )
        {
            affichage.push(
            {
                intituleScore: config.monstres[ key ],
                valeurScore: item.valeur
            } );
        } );

        affichage.push(
        {
            intituleScore: "Score total",
            valeurScore: self.levelScore
        } );

        return affichage;
    }

    endRun()
    {
        /*
         * Normalement, le timeout a déjà été effacé, mais par précaution ... on le 'supprime' de noveau
         */
        clearTimeout( this.timeOut );

        /*
         * Règles de scoring du run :
         *  + 1500 s'il n'a tué personne
         *  + 1000 s'il a toutes les kikettes
         *  + 1000 s'il à mis moins de 10 min pour tout finir (change en fonction du nobmre de niveaux)
         */

        var self = this,
            condition = "condition",
            nbPoints = "nbPoints";

        //Chaque bonus comporte une condition pour être validée et un score en conséquence

        //-- C'est ici pour
        var char = this.game.character,
            allkikette = char.hasAllKikette(),
            noKill = char.killedNobody(),
            goodTime = char.minuteTime() < config.scoring.TIME_MAX;

        var bonuses = {
            "Make love, not war":
            {
                condition: allkikette,
                nbPoints: config.scoring.NO_KILL
            },
            "Toutes les kikettes":
            {
                condition: allkikette,
                nbPoints: config.scoring.ALL_KIKETTE
            },
            "Temps réduit":
            {
                condition: goodTime,
                nbPoints: config.scoring.GOOD_TIME
            }
        };

        var affichage = [];

        //en fonction de s'il a réussi ou pas certains bonus du run, on affiche les points qu'il a gagné
        _.each( bonuses, function( item, key )
        {
            // console.log( item );
            // console.log( item[ 'nbPoints' ] );
            if ( item[ condition ] )
            {
                self.totalScore += item[ nbPoints ];
                affichage.push(
                {
                    intituleScore: key,
                    valeurScore: item[ nbPoints ]
                } );
            }
            else
            {
                affichage.push(
                {
                    intituleScore: key,
                    valeurScore: 0
                } );
            }
        } );

        var randomBonusName = Math.floor( Math.random() * ( bonusName.length - 1 ) );
        var randomBonusScore = Math.floor( Math.random() * ( bonusScore.length - 1 ) );

        // console.log( bonusName[ randomBonusName ] );
        // console.log( bonusScore[ randomBonusScore ] );

        affichage.push(
        {
            intituleScore: bonusName[ randomBonusName ],
            valeurScore: bonusScore[ randomBonusScore ]
        } );

        affichage.push(
        {
            intituleScore: "Score Total",
            valeurScore: this.totalScore
        } );

        return affichage;
    }

    // Début du niveau
    startLevel()
    {
        this.updateScore();
        this.levelScore = config.scoring.BEGIN_LEVEL;
        return;
    }

    startRun()
    {
        this.totalScore = 0;
        return;
    }
}

var bonusName =
        [
    "Avoir lu les commentaires du code",
    "Lire les crédits",
    "Avoir participé à une Gamejam.",
    "500eme partie !",
    "Avoir dit « c'est cool » en jouant à Euraka.",
    "Kaode le jeu.",
    "Ete 2015. True story.",
    "Alleeez c'est cadeau !",
    "On est pas là pour les points... si ?",
    "Arbalète !",
    "*Insérez ici une réplique comique*",
    "Yup.",
    "T'es un champion, champion !",
    "C'est pour toi, ça fait plaisir"
        ];

var bonusScore =
        [
    "Un bisou.",
    "Notre éternelle gratitude.",
    "Euraka vient habiter chez toi.",
    "1.000.000 points.",
    "Bonus pour la prochaine partie",
    "Un pixel offert pour l'achat de 2 pixels.",
    "/* Un commentaire en plus ! */",
    "Math.random(0,1)",
    "Rien"
        ]

module.exports = Scoring;