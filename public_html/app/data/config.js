// config.js
module.exports = {
    "app":
    {
        "version": "v0.0.1",
        "site": "http://www.thegamehasbegun.com/"
    },
    "paths":
    {
        "img": "./assets/img/",
        "audio": "./assets/audio/"
    },
    "map": {
        "blockSize": 44,
        "kiketteSize": 44,
        "priseSize": 44,
        "sortieSize": 44,
        "entreeSize": 44,
        "characterSize": 44,
        "tileSize": 46,
        "rayon": 650,
        "scale": 1,
        "scaleMin": 0.3,
        "scaleMax": 1.5,
        "speed": 80,
        "music": {
            "limitRecurrence": 3,
            "timeBeforeEndTransition": 5,
            "tabDefaultMusics" : [ 'musique/default1.mp3', 'musique/default2.mp3', 'musique/default3.mp3', 'musique/default4.mp3' ]
        }
    },
    "orientations": {
        "UP": "UP",
        "DOWN": "DOWN",
        "LEFT": "LEFT",
        "RIGHT": "RIGHT"
    },
    "eclairage" :{
        "TEMP_BASE" : 4000,
        "TEMP_AJOUT" : 1000
    },
    "projectile" : {
        "PORTEE" : 5
    },
    "energie" :{
        "JAUGE_MAX" : 8
    },
    "scoring":{
        "INTITULE_AFF": "affichage",
        "INTITULE_VAL" : "valeur",
        "UPDATE_TEMPO" : 1000,
        "BEGIN_LEVEL" : 1000,
        "LOSS_PER_SECOND" : 10,
        "KIKETTE_BONUS" : 400,
        "PER_ENNEMY" : 200,
        "PER_MUNITIONS" : 125,
        "ALL_KIKETTE" : 1000,
        "NO_KILL" : 1500,
        "TIME_MAX" : 10, // Temps max en minutes avant lequel on peut gagner un bonus
        "GOOD_TIME" : 1000,
        "MOBS" : { //Il faudra changer le nom des images pour que ça corresonde
            "CHAT": "chat.png"
        }
    },
    "nomsEntitee":{
        "PROJECTILE" : "projectile",
        "JOUEUR" : "eureka_",
        "BLOCK_BORD" : "bord",
        "BLOCK_MUR" : "mur",
        "BLOCK_PIEGE" : "piege",
        "BLOCK_PRISE" : "prise",
        "BLOCK_PAILLE" : "paille",
        "BLOCK_ENTREE" : "entree",
        "BLOCK_SORTIE" : "sortie",
        "BLOCK_KIKETTE" : "kikette",
        "BLOCK_SOL" : "sol"
    },
    "monstres":{
        "CHAT":"chat.png",
        "RAT" :"rat.png"
    }
}