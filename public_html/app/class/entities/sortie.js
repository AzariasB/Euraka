// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
var Sol = require( 'class/entities/sol.js' );

/**
 * Un block sol se trouve ... au sol  (lol)
 *  On peut marche dessus sans collisions
 */
class Sortie extends Block
{

    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = config.map.sortieSize;
        data.height = config.map.sortieSize;

        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );

        // @TODO
        // Définir l'orientation du halo dans Stage@init...
        super( game, config.nomsEntitee.BLOCK_SORTIE + 'DOWN', data, false );

    }
}

module.exports = Sortie;
