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
        "blockSize": 54,
        "kiketteSize": 54,
        "priseSize": 54,
        "sortieSize": 54,
        "entreeSize": 54,
        "characterSize": 54,
        "tileSize": 54,
        "rayon": 650,
        "scale": 1,
        "scaleMin": 0.3,
        "scaleMax": 1.5,
        "speed": 230,
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
        "PROJECTILE" : "tir_",
        "JOUEUR" : "eureka_",
        "BLOCK_BORD" : "bord",
        "BLOCK_BORDURE" : "bordure_01",
        "BLOCK_BORD_START_END" : "bordure_start_end",
        "BLOCK_MUR" : "mur",
        "BLOCK_PIEGE" : "piege",
        "BLOCK_PRISE" : "prise",
        "BLOCK_LUMIERE" : "lumiere",
        "BLOCK_PAILLE" : "paille",
        "BLOCK_ENTREE" : "start_end_halo_",
        "BLOCK_SORTIE" : "start_end_halo_",
        "BLOCK_KIKETTE" : "kikette",
        "BLOCK_SOL" : "sol"
    },
    "monstres":{
        "CHAT":"CHAT_RIGHT_1",
        "RAT" :"rat_"
    }
};