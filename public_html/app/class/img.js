// Data
var config = require( 'data/config.js' );

// Class
var Asset = require( 'class/asset.js' );

// Lib
var tools = require( 'lib/tools.js' );

class Img extends Asset
{
    constructor( path )
    {
        super()
        this.path = path;
        this.pathBase = config.paths.img;

        return;
    }

    preload()
    {
        this.obj = new Image();
        this.obj.src = this.pathBase + this.path;
        // this.obj.src = this.pathBase + this.path + '?'+ new Date().getTime();

        return;
    }

    onLoaded( callback )
    {
        this.obj.addEventListener( 'load', callback, false );
        this.checkReadyState();

        return;
    }
}

module.exports = Img;