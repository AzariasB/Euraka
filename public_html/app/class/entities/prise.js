// Data
var config = require( 'data/config.js' );

// Class
var Block = require( 'class/entities/block.js' );
var Sol = require( 'class/entities/sol.js' );

/**
 * Un block prise, c'est un peu comme un bloc destructible
 * Il faut juste gérer que le joueur puisse se rechargeer lorsqu'il arrive sur cette prise
 */
class Prise extends Block
{
    constructor( game, x, y, width, heigh )
    {

        var data = {};
        data.x = x;
        data.y = y;
        data.width = 180;
        data.height = 233;

        // On pose un block sol dessous car on peut la faire disparaitre
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );
        // On pose un block sol dessous car on peut la faire disparaitre
        var dataHalo = {
            "x": x,
            "y": y,
            "width": config.map.blockSize,
            "height": config.map.blockSize
        };
        this.haloLum = new Block( game, config.nomsEntitee.BLOCK_HALO_LUMIERE, dataHalo, false );
        game.stage.pushTabEntities( this.haloLum );

        super( game, config.nomsEntitee.BLOCK_LUMIERE, data, false );
    }

    isAddEnergy()
    {
        return true;
    }

    isActive()
    {
        return this.active;
    }

    disable()
    {
        this.haloLum.remove();
        super.disable();

        return;
    }
}

module.exports = Prise;