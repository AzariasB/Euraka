// Data
var config = require( 'data/config.js' );

// Class
var Destructible = require( 'class/destructible.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

/**
 * Un block bord se situe au bord de la map et empêche le joueur de s'échapper !
 */
class Paille extends Destructible
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.blockSize;
        data.height = config.map.blockSize;

        //Changer le nom du sprite
        super( game, config.nomsEntitee.BLOCK_PAILLE, data, [ 'sol' ], 1, false );

        return;
    }
}

module.exports = Paille;
