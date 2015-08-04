// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );
var Sol = require( 'class/entities/sol.js' );

// Lib
var tools = require( 'lib/tools.js' );
var _ = require( 'underscore' );

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
        super( game, game.stage.getStyle() + config.nomsEntitee.BLOCK_KIKETTE, 'game', data );


        // On pose un block sol dessous sinon pb avec transparence
        var sol = new Sol( game, x, y );
        game.stage.pushTabEntities( sol );

        return;
    }

    /**
     * Skin alternatif
     */
    getSpriteName( stage )
    {
        return stage.getStyle() + config.nomsEntitee.BLOCK_KIKETTE;
    }

    isBonus()
    {
        return true;
    }

    die()
    {
        super.die();

        if ( tools.isset( this.game.sounds.kicketteSound ) === false )
        {
            var kicketteSound = this.game.preloader.getAsset( 'sound', 'sons/kickette.mp3' );
            this.game.sounds.kicketteSound = kicketteSound.getObj();
        }

        this.game.sounds.kicketteSound.currentTime = 0;
        this.game.sounds.kicketteSound.play();

    }
}

module.exports = Kikette;