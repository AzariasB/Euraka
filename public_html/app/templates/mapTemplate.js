// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
var Projectile = require( 'class/entities/projectile.js' );
var Scoring = require( 'class/scoring.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );
require( 'lib/mousetrap.js' );
require( 'lib/raf.js' );

class MapTemplate
{

    constructor( game )
    {
        this.game = game;

        // Tout ce qui peut avoir du monvement sur la map
        // ou des animations
        this.tabEntities = [];
        this.tabEntitiesToUpdate = [];
        this.tabEntitiesIA = [];

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
        this.windowWidth = tools.getDocWidth();
        this.windowHeight = tools.getDocHeight();

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

    getTabEntities()
    {
        return this.tabEntities;
    }

    pushEntityToUpdate( v )
    {
        this.tabEntitiesToUpdate.push( v );

        return;
    }

    createProjectile( x, y, direction )
    {
        if (tools.isDebug() === true) {
            console.log( "Projectile créé" );
            console.log( x +', ' + y + ', ' + direction );
        }
        var dimension = config.map.blockSize;
        var projectile = new Projectile( this.game, x, y, dimension, dimension, direction );
        projectile.moving = true;
        this.tabEntities.push( projectile );
        this.tabEntitiesToUpdate.push( projectile );
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

        // On place les monstres dans les entité à update
        _.each( this.tabEntities, function( item )
        {
            if ( _.contains( config.map.ia, item.constructor.name ) === true )
            {
                this.tabEntitiesIA.push( item );
                this.tabEntitiesToUpdate.push( item );
            }
        }, this );

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
        this.tiledMap = [];

        for ( var y = 0; y < this.stage.getNbTuilesHauteur(); y++ )
        {
            this.tiledMap[ y ] = [];
            for ( var x = 0; x < this.stage.getNbTuilesLargeur(); x++ )
            {
                this.tiledMap[ y ][ x ] = 0;
            }
        }

        _.each( this.tabEntities, function( item, key )
        {
            self.tiledMap[ item.y ][ item.x ] = item;
            //            if(item.y >= 9)
            //            console.log(" x : " + item.x + " - y : " + item.y + " -Nom : " + item.constructor.name);
        } );

        return;
    }

    run()
    {
        // On attend que le CPU se calme
        _.delay( tools.removeOverlay, 2000 );

        // On lance l'animation
        this.start();

        // Run IA
        _.each( this.tabEntitiesIA, function( item )
        {
            item.runIa();
        } );

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
        Mousetrap.bind( 'z', this.character.lanceProjectile.bind( this.character ), 'keydown' );
        Mousetrap.bind( 'e', this.character.addEnergy.bind( this.character ), 'keydown' );
        Mousetrap.bind( 'q', this.game.gameController.showVictoire.bind( this.game.gameController ), 'keydown' );

        if ( tools.isDebug() === true )
        {
            Mousetrap.bind( '=', this.character.fillEnergy.bind( this.character ), 'keydown' );
            this.character.hasChangeEnergie();
        }

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

        this.character.onHasMoved( function()
        {
            self.centerMap();

            if ( self.character.aGagne() )
            {
                self.stop();
                return self.game.gameController.showVictoire();
            }
        } );

        return;
    }

    setSize()
    {
        var el = document.getElementById( 'l-main' ),
            elStyle = window.getComputedStyle( el );

        this.canvas.width = elStyle.width.replace( 'px', '' );
        this.canvas.height = elStyle.height.replace( 'px', '' );

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
        var ractive = this.game.gameTemplate.getRactive();
        
        ractive.set( 'score', this.game.scoring.getScore() );
        ractive.set( 'timer', tools.toHHMMSS( this.game.stageTime ) );

        return;
    }

    /**
     * Supperpose un effet Sépia / N&B sur la carte du monde
     */
    drawDark()
    {
        this.context.globalCompositeOperation = "source-over";
        this.context.fillStyle = '#000000';
        this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
        this.context.restore();
        // this.context.fillStyle = 'rgba(0, 0, 0, 0)';
        // ?
        this.context.fillStyle = 'none';
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
        var sizeRayon = this.getWidthRayon(),
            characterWidth = Math.round( this.character.getWidth() / 2 );

        // console.log( this.windowWidth );
        // console.log( this.windowHeight );

        // On dessine un cercle à la position du joueur pour en faire un clip
        this.context.beginPath();
        this.context.arc( this.character.x + this.game.stage.getX() + characterWidth, this.character.y + this.game.stage.getY() + characterWidth, sizeRayon / 2.2, 0, Math.PI * 2, true );
        this.context.closePath();
        this.context.clip();

        // On dessinne le monde en couleur dans le clip
        this.drawEntities();
        this.character.draw();
        this.halo.setData(
        {
            "x": this.character.x - ( sizeRayon / 2 ) + characterWidth,
            "y": this.character.y - ( sizeRayon / 2 ) + characterWidth,
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
        this.updateMovements();
        // this.updateTransitions();
        this.updateAnimations();

        return;
    }

    updateMovements()
    {
        // Estimate of the movement distance for one update
        var tick = 0;

        _.each( this.tabEntitiesToUpdate, function( e )
        {
            tick = Math.round( this.tileSize / ( e.moveSpeed / ( 1000 / this.realFPS ) ) );

            if ( e.isMoving() && e.canMove( tick ) )
            {
                // Lag or.. ?
                if ( isFinite( tick ) === false )
                {
                    tick = 5;
                }

                // if ( e.constructor.name === 'Chat' )
                // {
                //     console.log( tick );
                //     // console.log( e.moveSpeed );
                // }

                if ( e.orientation === config.orientations.LEFT )
                {
                    e.x = e.x - tick;
                }
                else
                if ( e.orientation === config.orientations.RIGHT )
                {
                    e.x = e.x + tick;
                }
                else
                if ( e.orientation === config.orientations.UP )
                {
                    e.y = e.y - tick;
                }
                else
                if ( e.orientation === config.orientations.DOWN )
                {
                    e.y = e.y + tick;
                }

                e.hasMoved();

                // if ( tools.isset( this.after_step_callback ) === true )
                // {
                //     this.after_step_callback();
                // }

                // if ( e.orientation === config.orientations.LEFT )
                // {
                //     e.movement.start( this.currentTime,
                //         function( x )
                //         {
                //             e.x = x;
                //             e.hasMoved();
                //         },
                //         function()
                //         {
                //             e.x = e.movement.endValue;
                //             e.hasMoved();

                //         },
                //         e.x - tick,
                //         e.x - 0,
                //         e.moveSpeed );
                // }
                // else if ( e.orientation === config.orientations.RIGHT )
                // {
                //     e.movement.start( this.currentTime,
                //         function( x )
                //         {
                //             e.x = x;
                //             e.hasMoved();
                //         },
                //         function()
                //         {
                //             e.x = e.movement.endValue;
                //             e.hasMoved();

                //         },
                //         e.x + tick,
                //         e.x + 0,
                //         e.moveSpeed );
                // }
                // else if ( e.orientation === config.orientations.UP )
                // {
                //     e.movement.start( this.currentTime,
                //         function( y )
                //         {
                //             e.y = y;
                //             e.hasMoved();
                //         },
                //         function()
                //         {
                //             e.y = e.movement.endValue;
                //             e.hasMoved();

                //         },
                //         e.y - tick,
                //         e.y - 0,
                //         e.moveSpeed );
                // }
                // else if ( e.orientation === config.orientations.DOWN )
                // {
                //     e.movement.start( this.currentTime,
                //         function( y )
                //         {
                //             e.y = y;
                //             e.hasMoved();
                //         },
                //         function()
                //         {
                //             e.y = e.movement.endValue;
                //             e.hasMoved();

                //         },
                //         e.y + tick,
                //         e.y + 0,
                //         e.moveSpeed );
                // }
            }
        }, this );

        return;
    }

    getEntitiesByName( Name )
    {
        var entities = [];

        _.each( this.tabEntities, function( item )
        {
            if ( item.constructor.name === Name )
            {
                entities.push( item );
            }
        } );

        return entities;
    }

    /**
     * Défini les variables à bouger en fonction du tick et de la position du joueur
     */
    updateTransitions( c )
    {
        var m; // Transition

        _.each( this.tabEntitiesToUpdate, function( e )
        {
            m = e.movement;

            if ( m.inProgress )
            {
                m.step( this.currentTime );
            }

        }, this );

        return;
    }

    updateAnimations()
    {
        var anim; // Animation

        _.each( this.tabEntitiesToUpdate, function( e )
        {
            anim = e.getAnimation();

            if ( e.isMoving() === true && tools.isset( anim ) === true && anim.update( this.currentTime ) === true )
            {
                e.updateSprite();
            }

        }, this );

        return;
    }

}

module.exports = MapTemplate;