// Data
var config = require( 'data/config.js' );
var Sol = require( 'class/entities/sol.js' );

// Class
var Entity = require( 'class/entity.js' );

class Kikette extends Entity
{
    constructor( game, x, y, speed )
    {
        var data = {};
        data.x = x;
        data.y = y;
        data.speed = 0;
        data.width = config.map.kiketteSize;
        data.height = config.map.kiketteSize;

        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );

        super( game, this.getSpriteName( game.stage ), 'game', data );

        return;
    }

    /**
     * Skin alternatif
     */
    getSpriteName( stage )
    {
        return stage.getStyle() + config.nomsEntitee.BLOCK_KIKETTE;
    }
}

module.exports = Kikette;