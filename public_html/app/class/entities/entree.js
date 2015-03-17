// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
var Sol = require( 'class/entities/sol.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

/**
 * Un block sol se trouve ... au sol  (lol)
 *  On peut marche dessus sans collisions
 */
class Entree extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.entreeSize;
        data.height = config.map.entreeSize;

        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );

        // @TODO
        // Définir l'orientation du halo dans Stage@init...
        super( game, this.getSpriteName( game.stage ), data, false );
    }

    getSpriteName( stage )
    {
        return config.nomsEntitee.BLOCK_ENTREE + 'DOWN';
    }
}

module.exports = Entree;
