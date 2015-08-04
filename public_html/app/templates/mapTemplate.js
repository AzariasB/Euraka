// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
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

    getTabEntitiesToUpdate()
    {
        return this.tabEntitiesToUpdate;
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

    addProjectile( projectile )
    {
        this.tabEntities.push( projectile );
        this.pushEntityToUpdate( projectile );

        return;
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
        _.each( this.stage.getTabEnemyEntity(), function( item )
        {
            this.tabEntitiesIA.push( item );
            this.tabEntitiesToUpdate.push( item );
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
        this.tiledMap = [];
        this.tiledMapEnemy = [];

        for ( var y = 0; y < this.stage.getNbTuilesHauteur(); y++ )
        {
            this.tiledMap[ y ] = [];
            this.tiledMapEnemy[ y ] = [];
            for ( var x = 0; x < this.stage.getNbTuilesLargeur(); x++ )
            {
                this.tiledMap[ y ][ x ] = 0;
                this.tiledMapEnemy[ y ][ x ] = 0;
            }
        }

        _.each( this.tabEntities, function( item, key )
        {
            // on ne met pas les ennemie qui bougent dedans
            if ( _.contains( config.map.ia, item.constructor.name ) === false )
            {
                this.tiledMap[ item.y ][ item.x ] = item;
            }
            //            if(item.y >= 9)
            //            console.log(" x : " + item.x + " - y : " + item.y + " -Nom : " + item.constructor.name);
        }, this );

        _.each( this.tabEntitiesIA, function( item, key )
        {
            this.tiledMapEnemy[ item.y ][ item.x ] = item;
            //            if(item.y >= 9)
            //            console.log(" x : " + item.x + " - y : " + item.y + " -Nom : " + item.constructor.name);
        }, this );

        return;
    }

    run()
    {
        // On attend que le CPU se calme
        _.delay( tools.removeOverlay, 2000 );

        // On lance l'animation
        this.start();

        if ( tools.isDebug() === true )
        {
            console.log( 'Nb IA : ' + this.tabEntitiesIA.length );
        }

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
        tools.isDebug() && Mousetrap.bind( 'q', this.game.gameController.showVictoire.bind( this.game.gameController ), 'keydown' );

        if ( tools.isDebug() === true )
        {
            Mousetrap.bind( '=', function()
            {
                self.character.fillEnergy();
                self.character.hasChangeEnergie();
            }, 'keydown' );
        }

        Mousetrap.bind( 'up', this.character.handlePlayerInputOff.bind( this.character, config.orientations.UP ), 'keyup' );
        Mousetrap.bind( 'down', this.character.handlePlayerInputOff.bind( this.character, config.orientations.DOWN ), 'keyup' );
        Mousetrap.bind( 'left', this.character.handlePlayerInputOff.bind( this.character, config.orientations.LEFT ), 'keyup' );
        Mousetrap.bind( 'right', this.character.handlePlayerInputOff.bind( this.character, config.orientations.RIGHT ), 'keyup' );

        this.character.onHasMoved( function()
        {
            self.centerMap();

            if ( self.game.gameController.getCurrentCodeStage() === 'tuto' )
            {
                _.each( self.tabEntitiesIA, function( item,key )
                {
                    item.runIa();
                } );
            }

            var block = self.character.getBlock( self.character ),
                blockEnemy = self.character.getBlockEnemy( self.character );

            if ( tools.isset( block ) === true )
            {
                if ( tools.isset( block.isOneshot ) === true && block.isOneshot() === true )
                {
                    tools.isDebug() && console.log("Piège a tué");
                    self.character.die();
                }
                else
                if ( tools.isset( block.isBonus ) === true && block.isBonus() === true )
                {
                    self.character.setKikette();
                    block.die();
                }
            }

            if ( tools.isset( blockEnemy ) === true )
            {
                if ( tools.isset( blockEnemy.isOneshot ) === true && blockEnemy.isOneshot() === true )
                {
                    if(tools.isDebug()){
                        var charPos = self.character.getCurrentTilde();
                        var chatPos = blockEnemy.getCurrentTilde();
                        console.log("Chat a tué");
                        console.log("Coordonées du joueur [x,y] :" + charPos.x + "," + charPos.y);
                        console.log("Coordonées du chat : [x,y] : " + chatPos.x + "," + chatPos.y);
                    }                    
                    self.character.die();
                }
            }

            if ( self.character.aGagne() )
            {
                self.stop();
                _.delay( self.game.gameController.showVictoire.bind( self.game.gameController ), 800 );
                return;
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
     * Centre la map sur le joueur
     */
    centerMap()
    {
        var charPos = this.character.calcAbsPos();

        this.stage.x = Math.floor( tools.toInt( -charPos.x + ( this.canvas.width / 2 ) ) );
        this.stage.y = Math.floor( tools.toInt( -charPos.y + ( this.canvas.height / 2 ) ) );

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

    getIsStop()
    {
        return this.isStopped;
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
        return Math.round( ( this.character.getRayonEcl() * 2 + 2 ) * config.map.tileSize + ( config.map.tileSize / 3 ) );
    }

    /**
     * Dessin du monde dans un cercle de rayon this.rayon + le picto du voyageur
     */
    drawCharacter()
    {
        var sizeRayon = this.getWidthRayon(),
            characterWidth = Math.round( this.character.getWidth() / 2 ),
            charPos = this.character.calcPos();

        if ( tools.isDebug() === true )
        {
            sizeRayon = 2000;
        }

        // On dessine un cercle à la position du joueur pour en faire un clip
        this.context.beginPath();
        this.context.arc( charPos.x + characterWidth, charPos.y + characterWidth, sizeRayon / 2.2, 0, Math.PI * 2, true );
        this.context.closePath();
        this.context.clip();

        // On dessinne le monde en couleur dans le clip
        this.drawEntities();
        this.character.draw();
        this.halo.setData(
        {
            "x": this.character.x,
            "y": this.character.y,
            "moveX": this.character.moveX - ( sizeRayon / 2 ) + characterWidth,
            "moveY": this.character.moveY - ( sizeRayon / 2 ) + characterWidth,
            "width": sizeRayon,
            "height": sizeRayon
        } );
        this.halo.draw();

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
        var pos = this.character.calcAbsPos(),
                coord = this.character.getCurrentTilde(),
            x = 140;

        this.context.textAlign = 'left';
        this.context.font = '14pt Impact';
        this.context.fillStyle = "#00FF00";
        this.context.fillText( "FPS : " + this.realFPS, x, 90 );
        this.context.fillText( "Char [x, y] : " + coord.x + ', ' + coord.y, x, 120 );
        this.context.fillText( "Char [pos.x, pos.y] : " + pos.x + ', ' + pos.y, x, 150 );
        //this.context.fillText( "Stage [x, y] : " + this.stage.x + ', ' + this.stage.y, x, 190 );
        var yText = 180;
        
        var Cats = this.getEntitiesByName("Chat");
        var self = this;
        _.each(Cats,function(cat){
            var tile = cat.getCurrentTilde();
            self.context.fillText("Chat [x,y] : " + tile.x + "," + tile.y ,x,yText);
            yText += 30;
        });

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
        this.updateAnimations();

        return;
    }

    updateMovements()
    {
        // Estimate of the movement distance for one update
        var tick = 0;
        var self = this;
        _.each( this.tabEntitiesToUpdate, function( e )
        {
            // console.log(e.constructor.name);

            tick = Math.round( this.tileSize / ( e.moveSpeed / ( 1000 / this.realFPS ) ) );

            // Lag or.. ?
            if ( e.constructor.name === 'Character' )
            {
                tick = Math.min( 5, tick );
            }

            if ( tick < config.map.tileSize && e.isAlive() === true && e.isMoving() === true && e.canMove( tick ) === true )
            {
                var before = e.getCurrentTilde();
                if ( e.orientation === config.orientations.LEFT )
                {
                    e.moveX = e.moveX - tick;
                }
                else
                if ( e.orientation === config.orientations.RIGHT )
                {
                    e.moveX = e.moveX + tick;
                }
                else
                if ( e.orientation === config.orientations.UP )
                {
                    e.moveY = e.moveY - tick;
                }
                else
                if ( e.orientation === config.orientations.DOWN )
                {
                    e.moveY = e.moveY + tick;
                }
                var after = e.getCurrentTilde();
                
                //Quand on est plus sur la même case
                if(before.x !== after.x || before.y !== after.y){
                    if(e.constructor.name === 'Chat'){
                        try{
                            self.tiledMapEnemy[before.y][before.x] = 0;
                            self.tiledMapEnemy[after.y][after.x] = e;
                        }catch(ex){
                            console.error(ex);
                        }
                    }
                }

                e.hasMoved();
            }
        }, this );

        return;
    }

    getEntities()
    {
        return this.tabEntities;
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