// Data
var config = require( 'data/config.js' );

var tabSprite = {
    "game": require( 'data/sprites-game.json' )
};

// lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Sprite
{
    constructor( code, file, game )
    {
        this.code = code;
        this.file = file;
        this.imgName = this.file;

        this.isDesktop = true;
        this.visible = true;
        this.json = this.getSpriteData();

        this.setFrameData();
        this.game = game;
        this.preloader = this.game.preloader;
        this.context = this.game.mapTemplate.getContext();

        // console.log( this.scale + '/' + this.imgName + '.' + this.getExtension() );
        this.img = this.preloader.getAssetObjet( file, this.imgName + '.' + this.getExtension() );
        this.center = true;

        // console.log( this.img );

        return;
    }

    setFrameData()
    {
        if ( tools.isset( this.json.frames ) === false ||
            tools.isset( this.json.frames[ this.code ] ) === false ||
            tools.isset( this.json.frames[ this.code ].frame ) === false )
        {
            console.log( this.code );
            console.log( this.json );
            console.log( _.keys( this.json.frames ) );
        }

        var frame = this.json.frames[ this.code ].frame;

        this.width = frame.w;
        this.height = frame.h;
        this.x = frame.x;
        this.y = frame.y;
    }

    updateImg( v )
    {
        this.code = v;
        this.setFrameData();

        return;
    }

    setVisible( v )
    {
        this.visible = v;

        return;
    }

    getWidth()
    {
        return this.width;
    }

    getHeight()
    {
        return this.height;
    }

    getX()
    {
        return this.x;
    }

    getY()
    {
        return this.y;
    }

    getExtension()
    {
        // return this.imgName === 'regions' || this.imgName === 'minimaps' ? 'jpg' : 'png';
        return 'png';
    }

    getImg()
    {
        return this.img;
    }

    getSpriteData()
    {
        return tabSprite[ this.imgName ];
    }

    setContext( ctx )
    {
        this.context = ctx;

        return;
    }

    draw( x, y, width, height)
    {
        if ( this.visible === false )
        {
            return;
        }

        // Hack du gros cul d'Euraka
        if ( this.code.indexOf( config.nomsEntitee.JOUEUR + config.orientations.UP ) > -1 ||
         this.code.indexOf( config.nomsEntitee.CHAT + config.orientations.DOWN ) > -1 )
        {
            width = config.map.characterSize - 12;
        }

        this.context.drawImage( this.img, this.x, this.y, this.width, this.height, x, y, width, height );

        return;
    }

    blink( speed, callback )
    {
        var self = this;

        this.blinking = setInterval( function()
        {
            self.toggleVisibility();
        }, speed );
    }

    stopBlinking()
    {
        if ( this.blinking )
        {
            clearInterval( this.blinking );
        }
        this.setVisible( true );

        return;
    }

    toggleVisibility()
    {
        if ( this.visible )
        {
            this.setVisible( false );
        }
        else
        {
            this.setVisible( true );
        }

        return;
    }
}

module.exports = Sprite;