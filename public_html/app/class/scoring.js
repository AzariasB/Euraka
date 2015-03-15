// Data
var config = require( 'data/config.js' );

// Class
var Stage = require( 'class/stage.js' );

var intituleScore = config.scoring.INTITULE_AFF;
var valeurScore = config.scoring.INTITULE_VAL;

class Scoring
{
    constructor(game)
    {
        //Pour pouvoir déposer et récupérer des informations
        this.game = game
        
        this.levelScore= config.scoring.BEGIN_LEVEL;
        this.totalScore = 0;
        
        this.timeOut;
        return;
    }
    
    updateScore()
    {
        var self = this;
        this.timeOut = setTimeout(function(){
            self.lossPoints(config.scoring.LOSS_PER_SECOND);
        },config.scoring.UPDATE_TEMPO);

        return;
    }
    
    //Si on tue un ennemi ... on gagne un certain nombre de points
    gainPoints( points )
    {
        this.levelScore += points;
        return;
    }
    
    lossPoints( points)
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
        clearTimeout(this.timeOut);
        /*
         * Règles de scoring :
         *  +125 par munitions restantes
         *  +400 si kikette en sa possession
         */
        
        //Nom de la fonction à changer très probablement => fonction qui permet de savoir le nombre de munitions du joueur
       var bonusMunition = config.scoring.PER_MUNITIONS * this.game.character.getMunitions();
        this.levelScore += bonusMunition;
        if(this.game.character.hasKikette()){
            this.levelScore += config.scoring.KIKETTE_BONUS;
        }
        
        this.totalScore += this.levelScore;
        
        var self = this;
        var affichage = [];
        
        var killedElements = this.game.character.getEntityKilled;
        _.each(killedElements,function(item,key){
               affichage.push(
                       {
                           intituleScore : config.monstres[key],
                           valeurScore : item.valeur
                       })
        });
        
        affichage.push(
                {
                    intituleScore : "Score total",
                    valeurScore : self.levelScore
                })
                
        return affichage;
    }
    
    endRun()
    {
        /*
         * Normalement, le timeout a déjà été effacé, mais par précaution ... on le 'supprime' de noveau
         */
        clearTimeout(this.timeOut);
        
        /*
         * Règles de scoring du run :
         *  + 1500 s'il n'a tué personne
         *  + 1000 s'il a toutes les kikettes
         *  + 1000 s'il à mis moins de 10 min pour tout finir (change en fonction du nobmre de niveaux)
         */
        
        var self = this;
        var condition = "condition";
        var nbPoints = "nbpoints";
        
        //Chaque bonus comporte une condition pour être validée et un score en conséquence
        
        //-- C'est ici pour 
        var bonuses = 
                {
                    "Make love, not war" :{
                        condition : self.game.character.killedNobody(),
                        nbPoints : config.scoring.NO_KILL
                    },
                    "Toutes les kikettes" :{
                        condition : self.game.character.hasAllKikette(),
                        nbPoints : config.scoring.ALL_KIKETTE
                    },
                    "Temps réduit" : {
                        condition : self.game.character.minuteTime() < config.scoring.TIME_MAX,
                        nbPoints : config.scoring.GOOD_TIME
                    }
                }
            
            var affichage = 
                    [];

            //en fonction de s'il a réussi ou pas certains bonus du run, on affiche les points qu'il a gagné
            _.each(bonuses,function(item , key){
                if(item[condition]){
                    self.totalScore += item[nbPoints];
                    affichage.push(
                            {
                                intituleScore : key,
                                valeurScore : item[nbPoints]
                            });
                }else{
                    affichage.push(
                            {
                                intituleScore : key,
                                valeurScore : 0
                            });
                }
            });
            
            var randomLol = Math.floor(Math.random() * (bonusLOL.length - 1));
            affichage.push(
                    {
                        intituleScore : bonusLOL[randomLol][intituleScore],
                        valeurScore : bonusLOL[randomLol][valeurScore]
                    }    
                );
        
            affichage.push(                {
                intituleScore : "Score Total",
                valeurScore : this.totalScore
            });
        
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


var bonusLOL =
        [
    {
        intituleScore : "Avoir lu les commentaires du code",
        valeurScore : "/* ~1000 */"
    },
    {
        intituleScore : "Avoir lu les crédits",
        valeurScore : "Just a kiss"
    }
        ]

module.exports = Scoring;