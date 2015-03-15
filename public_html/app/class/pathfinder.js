// Data
var config = require( 'data/config.js' );

// Lib
var tools = require( 'lib/tools.js' );

var maps = {
    // region1 : require( 'data/map/region1.js' ),
    // region2 : require( 'data/map/region2.js' ),
    // region4 : require( 'data/map/region4.js' ),
    // demo    : require( 'data/map/demo.js' ),
    // mallore : require( 'data/map/mallore.js' )
};

// Lib
var PF = require( 'lib/pathfinding/PathFinding.js' );

class Pathfinder
{
    constructor( game )
    {
        this.game      = game;

        this.code      = null;
        this.end       = [];
        this.handleSea = false;

        this.finder = new PF.BiBestFirstFinder(
        {
            allowDiagonal    : false,
            dontCrossCorners : true,
            heuristic        : PF.Heuristic.euclidean
        } );

        return;
    }

    /**
    * Autorise le joueur à marcher sur l'eau, rebuild la matrice
    * @param {bool} v true : autorise l'accès à la mer | false : block l'accès
    */
    toogleHandleSea(v)
    {
        if (this.handleSea !== v) {
            this.handleSea = v;
            this.setGrid( this.code );
        }

        return;
    }

    getGrid()
    {
        return this.grid;
    }

    setGrid( code )
    {
        this.code   = code;
        this.grid   = maps[ this.code ].data;
        this.matrix = new PF.Grid( this.grid.length, this.grid[ 0 ].length, this.grid, this.handleSea);

        return;
    }

    /**
    * Position sur la grid pour le pathfinding
    * @param {x} int index sur la grid
    * @param {y} int index sur la grid
    */
    setStartPosition( x, y )
    {
        this.start = [ x, y ];

        return;
    }

    setPositionByPixel( x, y )
    {
        return this.convertPositionToGrid( x, y );
    }

    /**
    * Si le terrain est un mur ou non
    * @param {int} x le x et y sont inversé par rapport au path finding
    * @param {int} y le x et y sont inversé par rapport au path finding
    * @return {int} id du terrain type
    */
    getTerrain( x, y )
    {
        if ( tools.isset( x ) === false )
        {
            x = this.end[ 0 ];
        }
        if ( tools.isset( y ) === false )
        {
            y = this.end[ 1 ];
        }

        return tools.isset( this.grid[ y ] ) !== false && tools.isset( this.grid[ y ][ x ] ) !== false && tools.isset( this.grid[ y ][ x ].t ) !== false ? this.grid[ y ][ x ].t : config.map.wall;
    }

    /**
    * Si le terrain est un mur ou non
    * @param {int} x le x et y sont inversé par rapport au path finding
    * @param {int} y le x et y sont inversé par rapport au path finding
    * @return {bool}
    */
    isColliding( x, y )
    {
        return this.getTerrain( x, y ) === config.map.wall;
    }

    convertPositionToGrid( x, y )
    {
        return {
            "x": Math.floor( x / this.game.mapView.getTileSize() ),
            "y": Math.floor( y / this.game.mapView.getTileSize() )
        };
    }

    findPath( x, y )
    {
        var result = [], gridBackup;

        if ( this.isColliding( x, y ) || tools.isset( this.start ) === false )
        {
            return result;
        }

        this.end = [ x, y ];

        // Be aware that grid will be modified in each path-finding, and will not be usable afterwards.
        // If you want to use a single grid multiple times, create a clone for it before calling findPath.
        gridBackup  = this.matrix.clone();
        result      = this.finder.findPath( this.start[ 0 ], this.start[ 1 ], x, y, this.matrix );
        this.matrix = gridBackup;

        return result;
    }
}

module.exports = Pathfinder;