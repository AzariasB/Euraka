// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/block.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );
var Projectile = require('class/projectile.js');

var Scoring = require( 'class/scoring.js' );
require( 'lib/mousetrap.js' );
require( 'lib/raf.js' );

class MapTemplate
{

    constructor( game )
    {
        this.game = game;
        this.game.mapView = this;

        // Tout ce qui peut avoir du monvement sur la map
        // ou des animations
        this.tabEntities = [];
        this.tabEntitiesToUpdate = [];

        //Enregistrement sour forme de tableau 2d pour plus de performance lors du test de HitBox
        this.tiledMap = [ 0 ][ 0 ];

        // Taille des tuiles
        this.tileSize = config.map.tileSize;

        // Taille du rayon
        this.rayon = config.map.rayon;

        //Scoring
        this.score = new Scoring( this.game );

        // Variable pour l'animation
        this.lastTime = new Date();
        // Fork rAF si on veut changer
        this.FPS = 60;
        this.frameCount = 0;
        this.realFPS = this.frameCount;
        // FPS alternatif
        this.then = Date.now();
        this.interval = 1000 / this.FPS;

        this.stage = null;
        this.character = null;
        this.halo = null;

        // Récupération du canvas
        this.canvas = document.getElementById( 'stage' );
        this.context = this.canvas.getContext( '2d' );
        this.context.imageSmoothingEnabled = true;
        this.context.mozImageSmoothingEnabled = true;

        this.path = null;

        // On bind les evenements
        this.bindEvent();

        // On défini une taille pour le canvas
        this.setSize();

        return;
    }

    pushEntityToUpdate( v )
    {
        this.tabEntitiesToUpdate.push( v );

        return;
    }

    createProjectile(x,y, direction)
    {
        console.log("Projectile créé");
        var dimension = config.map.blockSize;
        var projectile = new Projectile(this.game, x, y, dimension, dimension);
        this.tabEntities.push(projectile);
        this.tabEntitiesToUpdate.push(projectile);
    }

    getContext()
    {
        return this.context;
    }

    getTileSize()
    {
        return this.tileSize;
    }

    /**
     * Affiche la map dans le canvas, ajoute le sprite dans la classe
     * @params WorldPart
     */
    setStage( stage )
    {
        this.stage = stage;
        this.tabEntities = this.stage.getTabEntities();
        this.initTiledMap();
        return;
    }

    /**
     * Affiche le joueur sur le canvas, ajoute le sprite à la classe, centre la map sur le joueur
     * @params Character
     */
    setCharacter( c )
    {
        this.character = c;
        this.tabEntitiesToUpdate.push( c );

        // this.tabEntities.push( this.character );

        // On bind les callback du déplacement
        // this.charEvent();
        // On a besoin d'une valeur x,y pour la map
        this.centerMap();

        return;
    }

    /**
     * Affiche le joueur sur le canvas, ajoute le sprite à la classe, centre la map sur le joueur
     * @params Character
     */
    setHalo( h )
    {
        this.halo = h;

        return;
    }

    /**
     * Tous les blocs de la map ( instanceof('block')
     */
    getBlocks()
    {
        var blocks = [];

        _.each( this.tabEntities, function( item )
        {
            if ( item instanceof Block )
            {
                toRetun[ blocks.length ] = item;
            }
        } );

        return blocks;
    }

    initTiledMap()
    {
       // console.log("Nombre d'entités : " + this.stage.getTabEntities().length);
        var self = this;
        this.tiledMap = []

        for(var y = 0; y < this.stage.getNbTuilesHauteur(); y++){
            this.tiledMap[y] = [];
            for(var x = 0; x < this.stage.getNbTuilesLargeur(); x++){
                this.tiledMap[y][x] = 0;
            }
        }

        _.each( this.tabEntities, function( item, key )
        {
            self.tiledMap[ item.y ][ item.x ] = item;
//            if(item.y >= 9)
//            console.log(" x : " + item.x + " - y : " + item.y + " -Nom : " + item.constructor.name);
        } );
    }

    run()
    {
        // On attend que le CPU se calme
        _.delay( tools.removeOverlay, 2000 );

        // On lance l'animation
        this.start();

        return;
    }

    charEvent()
    {
        var self = this;

        Mousetrap.bind( 'up', this.character.handlePlayerInput.bind( this.character, config.orientations.UP ), 'keydown' );
        Mousetrap.bind( 'down', this.character.handlePlayerInput.bind( this.character, config.orientations.DOWN ), 'keydown' );
        Mousetrap.bind( 'left', this.character.handlePlayerInput.bind( this.character, config.orientations.LEFT ), 'keydown' );
        Mousetrap.bind( 'right', this.character.handlePlayerInput.bind( this.character, config.orientations.RIGHT ), 'keydown' );

        // Action 'spéciales'
        Mousetrap.bind( 'a', this.character.addRayonEclairage.bind( this.character ), 'keydown' );
        Mousetrap.bind( 'z', this.character.lanceProjectile.bind(this.character), 'keydown' );

        // Mousetrap.bind( 'up', function() {
        //     self.character.handlePlayerInput.bind( self.character, config.orientations.UP );
        //     // Mousetrap.unbind( ['up', 'z']);
        // }, 'keypress' );
        // Mousetrap.bind( 'down', function() {
        //     self.character.handlePlayerInput.bind( self.character, config.orientations.DOWN );
        //     // Mousetrap.unbind( ['down', 's']);
        // }, 'keypress' );
        // Mousetrap.bind( 'left', function() {
        //     self.character.handlePlayerInput.bind( self.character, config.orientations.LEFT );
        //     // Mousetrap.unbind( ['left', 'q']);
        // }, 'keypress' );
        // Mousetrap.bind( 'right', function() {
        //     self.character.handlePlayerInput.bind( self.character, config.orientations.RIGHT );
        //     // Mousetrap.unbind( ['right', 'd']);
        // }, 'keypress' );

        Mousetrap.bind( 'up', this.character.handlePlayerInputOff.bind( this.character, config.orientations.UP ), 'keyup' );
        Mousetrap.bind( 'down', this.character.handlePlayerInputOff.bind( this.character, config.orientations.DOWN ), 'keyup' );
        Mousetrap.bind( 'left', this.character.handlePlayerInputOff.bind( this.character, config.orientations.LEFT ), 'keyup' );
        Mousetrap.bind( 'right', this.character.handlePlayerInputOff.bind( this.character, config.orientations.RIGHT ), 'keyup' );

        // var self = this;
        // this.character.onBeforeStep( function() {} );

        this.character.onAfterStep( function()
        {
            self.centerMap();
        } );

        // this.character.onStopPathing( function()
        // {
        // } );

        return;
    }

    setSize()
    {
        var el = document.getElementById( 'l-main' ),
            elStyle = window.getComputedStyle( el );

        this.canvas.width = elStyle.width.replace( 'px', '' ) - 100;
        this.canvas.height = elStyle.height.replace( 'px', '' ) - 60;

        return;
    }

    bindEvent()
    {
        this.canvas.onselectstart = function()
        {
            return false;
        };

        return;
    }

    /**
     * Click sur le bouton GO!
     */
    handleGo( e )
    {
        var pos = this.mouse;

        // Si on clique là où on vient de cliquer, on ne bouge pas
        if ( pos.x === this.previousClickPosition.x && pos.y === this.previousClickPosition.y )
        {
            return;
        }
        else
        {
            this.previousClickPosition = pos;
        }

        // On cherche les effets map
        var tabEffet = this.game.joueur.getEffet( 'map' );
        _.each( tabEffet, function( item )
        {
            item.apply( this.character );
        }, this );

        // Si le jeu est démaré
        if ( this.started )
        {
            this.game.aventureView.hideAction();

            this.isDrawParcourt = false;
            this.character.go( this.path );

            if ( this.character.isOnBoat() === true )
            {
                this.boat.go( this.path );
            }
        }

        return;
    }

    /**
     * Créer le parcourt du joueur tuile / tuile
     */
    getPath( pos, dest )
    {
        var x, y;

        // Click sur un point particulier
        this.tuile = _.find( this.tabClickable, function( item )
        {
            return item.hit( pos.x, pos.y ) === true;
        } );

        // Chercher si c'est une ville
        if ( tools.isset( this.tuile ) === true && ( this.character.isOnBoat() === false && this.tuile.constructor.name !== 'Monture' ) )
        {
            x = this.tuile.x;
            y = this.tuile.y;
        }
        // Point non particulier
        else
        {
            x = dest.x;
            y = dest.y;
        }

        this.path = this.stage.pathfinder.findPath( x, y );

        return;
    }

    hasPath()
    {
        return this.path !== null && this.path.length > 0;
    }

    /**
     * Centre la map sur le joueur
     */
    centerMap()
    {
        this.stage.x = Math.floor( tools.toInt( -this.character.x + ( this.canvas.width / 2 ) ) );
        this.stage.y = Math.floor( tools.toInt( -this.character.y + ( this.canvas.height / 2 ) ) );

        // Limite pour que l image ne sorte pas du canvas
        return this.getLimitMap();
    }

    /**
     * Limite pour que l image ne sorte pas du canvas
     */
    getLimitMap()
    {
        // Limite pour que l image ne sorte pas du canvas
        var maxX = -this.stage.getMaxX() + this.canvas.width,
            maxY = -this.stage.getMaxY() + this.canvas.height;

        if ( this.stage.x > 0 ) this.stage.x = 0;
        if ( this.stage.y > 0 ) this.stage.y = 0;
        if ( this.stage.x < maxX ) this.stage.x = maxX;
        if ( this.stage.y < maxY ) this.stage.y = maxY;

        return;
    }

    /**
     * Refresh le canvas
     */
    tick()
    {
        this.currentTime = new Date().getTime();
        if ( this.started )
        {
            this.update();
            this.render();
        }

        if ( this.isStopped === false )
        {
            // raf( this.tick.bind( this ) );
            window.requestAnimationFrame( this.tick.bind( this ) );
        }

        return;
    }

    /**
     * Démarre le referesh du canvas
     */
    start()
    {
        this.started = true;
        this.isStopped = false;
        this.hasNeverStarted = false;
        this.score.startRun();
        this.score.startLevel();
        this.tick();

        tools.log( "Game loop started." );
        return;
    }

    /**
     * Arrête le refresh du canvas
     */
    stop()
    {
        tools.log( "Game loop stopped." );
        this.isStopped = true;
        this.started = false;
        return;
    }

    /**
     * Appel les fonctionts pour dessiner sur le canvas
     */
    render()
    {
        // this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.context.save();

        // On dessine le monde pour appliquer le sépia
        this.drawDark();
        this.drawCharacter();
        this.updateUi();

        if ( tools.isDebug() === true )
        {
            this.drawFps();
        }

        this.context.restore();

        return;
    }

    updateUi()
    {
        this.game.gameView.set( 'score', this.game.scoring.getScore() );
        this.game.gameView.set( 'timer', tools.toHHMMSS( this.game.scoringTimer ) );

        return;
    }

    /**
     * Supperpose un effet Sépia / N&B sur la carte du monde
     */
    drawDark()
    {
        this.context.globalCompositeOperation = "source-over";
        // this.context.fillStyle = '#34383f';
        this.context.fillStyle = '#000000';
        this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        this.context.restore();
        this.context.save();

        return;
    }

    getWidthRayon()
    {
        return Math.round( ( this.character.getRayonEcl() + 1 ) * config.map.tileSize + ( config.map.tileSize / 8 ) );
    }

    /**
     * Dessin du monde dans un cercle de rayon this.rayon + le picto du voyageur
     */
    drawCharacter()
    {
        var sizeRayon = this.getWidthRayon();
        // On dessine un cercle à la position du joueur pour en faire un clip
        this.context.beginPath();
        this.context.arc( Math.round( ( ( this.character.x + this.game.stage.getX() ) / 2 ) + 425 ), Math.round( ( ( this.character.y + this.game.stage.getY() ) / 2 ) + 250 ), sizeRayon, 0, Math.PI * 2, true );
        this.context.closePath();
        this.context.clip();

        // sizeRayon = sizeRayon + ((this.character.getRayonEcl() + 1 ) * config.map.tileSize);

        // On dessinne le monde en couleur dans le clip
        this.drawEntities();
        this.character.draw();
        this.halo.setData(
        {
            "x": this.character.x - sizeRayon + Math.round( sizeRayon / 2 ),
            "y": this.character.y - sizeRayon + Math.round( sizeRayon / 2 ),
            "width": sizeRayon,
            "height": sizeRayon
        } );
        this.halo.draw();
        // // On dessinne le joueur

        // On restore l'ensemble du canvas pour ne plus dessiner uniquement dans le clip
        this.context.restore();
        this.context.save();

        return;
    }

    /**
     * Calcul les FPS réals
     */
    updateFps()
    {
        var nowTime = new Date(),
            diffTime = nowTime.getTime() - this.lastTime.getTime();

        if ( diffTime >= 1000 )
        {
            this.realFPS = this.frameCount;
            this.frameCount = 0;
            this.lastTime = nowTime;
        }

        this.frameCount++;

        return;
    }

    /**
     *
     */
    drawFps()
    {
        var x = 140;
        this.context.textAlign = 'left';
        this.context.font = '14pt Impact';
        this.context.fillStyle = "#00FF00";
        this.context.fillText( "FPS : " + this.realFPS, x, 90 );
        this.context.fillText( "Char [x, y] : " + this.character.x + ', ' + this.character.y, x, 120 );

        return;
    }

    /**
     * Affichage des info de débug
     */
    drawEntities()
    {
        _.each( this.tabEntities, function( entity )
        {
            entity.draw();
        }, this );

        return;
    }

    /**
     * Déplace et anim tous les sprites et les animations
     */
    update()
    {
        this.updateFps();
        this.updateMovement();
        this.updateTransitions();
        this.updateAnimations();

        return;
    }

    updateMovement()
    {
        _.each( this.tabEntitiesToUpdate, function( e )
        {
            this.updateMovementEntity( e );
        }, this );

        return;
    }

    getRealFPS()
    {
        return this.realFPS;
    }

    getEntitiesByName( Name )
    {
        var entities = [];
        _.each(this.tabEntities,function(item){
            if(item.constructor.name === Name){
                entities.push(item);
            }
        });

        return entities;
    }

    /**
     * Défini les variables à bouger en fonction du tick et de la position du joueur
     */
    updateMovementEntity( c )
    {
        // Estimate of the movement distance for one update
        var tick = Math.round( this.tileSize / ( c.moveSpeed / ( 1000 / this.realFPS ) ) );

        if ( c.isMoving() === true && c.canMove( tick ) )
        {
            c.move( tick );
        }

        if(c.constructor.name === "Character" ){
            if(c.aGagne()){
                this.stop();
                return this.game.gameController.showVictoire();
            }
        }

        if(c.constructor.name === "Projectile")
        {
            c.avance();
        }

            //Si le projectile a atteind sa portee maximale, on le détruit !
            //
//            if(c.getPortee() === 0 ){
//               delete this.tabEntities[this.tabEntities.indexOf(c)];
//            }
        // NOTE
        // LAST step = c.x - this.tileSize / 2
        // pour centrer la pastille du joueur

        // if ( c.isMoving() && c.movement.inProgress === false )
        // {
        //     if ( c.orientation === config.orientations.LEFT )
        //     {
        //         c.movement.start( this.currentTime,
        //             function( x )
        //             {
        //                 c.x = x;
        //                 c.hasMoved();
        //             },
        //             function()
        //             {
        //                 c.x = c.movement.endValue;
        //                 c.hasMoved();
        //                 c.nextStep();
        //             },
        //             c.x - tick,
        //             c.x - this.tileSize,
        //             c.moveSpeed );
        //     }
        //     else if ( c.orientation === config.orientations.RIGHT )
        //     {
        //         c.movement.start( this.currentTime,
        //             function( x )
        //             {
        //                 c.x = x;
        //                 c.hasMoved();
        //             },
        //             function()
        //             {
        //                 c.x = c.movement.endValue;
        //                 c.hasMoved();
        //                 c.nextStep();
        //             },
        //             c.x + tick,
        //             c.x + this.tileSize,
        //             c.moveSpeed );
        //     }
        //     else if ( c.orientation === config.orientations.UP )
        //     {
        //         c.movement.start( this.currentTime,
        //             function( y )
        //             {
        //                 c.y = y;
        //                 c.hasMoved();
        //             },
        //             function()
        //             {
        //                 c.y = c.movement.endValue;
        //                 c.hasMoved();
        //                 c.nextStep();
        //             },
        //             c.y - tick,
        //             c.y - this.tileSize,
        //             c.moveSpeed );
        //     }
        //     else if ( c.orientation === config.orientations.DOWN )
        //     {
        //         c.movement.start( this.currentTime,
        //             function( y )
        //             {
        //                 c.y = y;
        //                 c.hasMoved();
        //             },
        //             function()
        //             {
        //                 c.y = c.movement.endValue;
        //                 c.hasMoved();
        //                 c.nextStep();
        //             },
        //             c.y + tick,
        //             c.y + this.tileSize,
        //             c.moveSpeed );
        //     }
        // }

        return;
    }

    /**
     * Fait passer les transitions de toutes les entitées à la prochiane étape
     */
    updateTransitions()
    {
        var m = null;

        _.each( this.tabEntities, function( entity )
        {
            m = entity.movement;
            if ( m )
            {
                if ( m.inProgress )
                {
                    m.step( this.currentTime );
                }
            }
        }, this );

        return;
    }

    updateAnimations()
    {
        return;
    }

}

module.exports = MapTemplate;
