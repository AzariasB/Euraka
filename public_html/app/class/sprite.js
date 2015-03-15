// Data
var config = require( 'data/config.js' );

var tabSprite = {
    "spritesheet": require( 'data/spritesheet.json' )
};

// lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

class Sprite
{
    constructor( code, file, game )
    {
        // console.log( tabSprite );
        // console.log(game);
        // console.log( code );

        if (code === 410) {
            code = config.nomsEntitee.BLOCK_PRISE;
        }

        this.code = code;
        this.file = file;
        this.imgName = this.file;

        this.isDesktop = true;
        this.visible = true;
        this.json = this.getSpriteData();

        // console.log(this.code);
        // console.log(this.json);
        // console.log(_.keys(this.json.frames));

        this.width = this.json.frames[ this.code ].frame.w;
        this.height = this.json.frames[ this.code ].frame.h;
        this.x = this.json.frames[ this.code ].frame.x;
        this.y = this.json.frames[ this.code ].frame.y;
        this.game = game;
        this.preloader = this.game.preloader;
        this.context = this.game.mapView.getContext();

        // console.log( this.scale + '/' + this.imgName + '.' + this.getExtension() );
        this.img = this.preloader.getAssetObjet( 'game', this.imgName + '.' + this.getExtension() );
        this.center = true;

        // console.log( this.img );

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

    draw( x, y, width, height, center )
    {
        if ( this.visible === false )
        {
            return;
        }

        // if ( this.center === true && center !== false )
        // {
        //     x = Math.round( x - ( width / 2 ) + ( this.game.mapTemplate.tileSize / 2 ) );
        //     y = Math.round( y - ( height / 2 ) + ( this.game.mapTemplate.tileSize / 2 ) );
        // }

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