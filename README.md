# Euraka - Fancy Tree Studio

[DEMO](http://www.thegamehasbegun.com/euraka/index.html)

## Description

Euraka est une étrange créature provenant d'un futur sombre, où l'Humanité semble s'être éteinte...

A la tête d'un gang de petits individus (légèrement illuminés), notre héros dérobe régulièrement de l’énergie à l’abri dans lequel il réside, par le biais de prises et autres sources d'éclairage.

Excédé par cet indigne vandalisme, mais désireuse de satisfaire le plus grand nombre, l'Intelligence Artificielle en charge de la faune du bunker décide d'envoyer Euraka dans le temps.

Parcourant les moments clefs de l'Histoire, peut-être trouvera t-il ce qu'il semble convoiter : La Lumière.

(… mais parviendra t-il seulement à rentrer chez lui ?!)

## [Fancy Tree Studio](http://www.thegamehasbegun.com/)
* Azarias (dev)
* Chloé (graph)
* Qentin (gamedesign)
* Fabien (dev)

## Mission
Grenoble Game Jam 48h in [La Casemate](http://lacasemate.fr/) - 2015
Theme : light *(UNESCO)*

##Todo
- [ ] Bugs
  - [x] Super call bug
  - [x] Display bug
  - [x] Death bug
  - [x] Bale of straw bug
  - [x] Lightening bug
  - [x] Cat-don't-kill bug
  - [ ] FrameRate Drop (falling to 10fps !)
  - [ ] Lightening creation bug
- [ ] Updates
  - [ ] Cats moves
  - [ ] Map rotation
  - [ ] Change lightening duration
  - [ ] Counting bonuses
  - [ ] Scoring improvement (no more random !)

## Architecture development

### Client libraries used

* [UnderscoreJS](http://underscorejs.org/) 1.8.1
* [Ractive.js](http://www.ractivejs.org/) 0.6.1

### Css code style

* [SMACSS](https://smacss.com/)

### Plugins

* rAF
* https://github.com/ccampbell/mousetrap 1.4.6

### Plugins dev-side

* [Browserify](https://github.com/substack/node-browserify) 9.0.3
* [Watchify](https://github.com/substack/watchify) 2.4.0
* [Babel](https://github.com/babel/babel) 5.0.3
* [Gulp](https://github.com/gulpjs/gulp) 3.8.11

### Thanks to

* http://www.leshylabs.com/apps/sstool/
* http://littleworkshop.fr/
* https://popcorntime.io/

## Development explanation
Browserify permet de faire des appels au class JS avec la méthode ** require ** et donne la possibilité d'appliquer des transformations au code.
De plus, il compacte tous les fichiers en 1 seul, ce qui préserve les requettes HTTP.

Babel permet d'utiliser du ES6 (Ecmascript 6) qui produit un code proche des autres langages avec des mots clés comme Class, extends,... pour le convertir en ES5, car l'ES6 n'est pas encore finalisé et donc pas compatible avec les navigateurs.

La librairie underscore permet de compléter des fonctions dont on a fréquemment besoin (each, contains, ...)

La librairie Ractive permet le d'afficher des templates en précompilant le JS, elle offre le 2-way-bindin, c'est-à-dire que la vue peut mettre à jour le model et le model peut mettre à jour la vu, sans que le développeur n'écrive pas de code/marqueur particulier pour le faire.

### Process

Browserify créer un bundle composé de tous les fichiers JS, watchify identifie chaque modification de fichier pour ne lancer la compilation du bundle que sur la partie modifiée, babel converti le code ES6 en ES5.


### Dev space

You can download assets for Euraka here
[Assets](http://www.thegamehasbegun.com/download/euraka-assets.zip/assets/download/euraka-assets.zip)
and
[Map generator](http://www.thegamehasbegun.com/download/euraka-map.zip/assets/download/euraka-map.zip)

1. Install [node](https://nodejs.org/)
1. `git clone` project and `cd` into project
1. run these commande line **IMPORTANT** `sudo` or `Administrateur`
```
npm i -g npm-install-missing gulp
npm-install-missing
npm i --save ractive underscore
```

## Commandes
### Open one console for start server
```
gulp connect
```
### Open one console for build and watch js file
```
gulp js
```


### Deploiments **executable for win, linux, mac**
```
gulp build
```
