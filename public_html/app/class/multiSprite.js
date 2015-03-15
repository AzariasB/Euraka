// Data
var config = require( 'data/config.js' );

// Class
var Entity = require( 'class/entity.js' );

class MultiSprite extends Entity
{

    constructor( game, name, data, spritesArray, currentSprite )
    {

        super( game, name, 'spritesheet', data );

        this.spriteIndex = currentSprite;
        this.spritesArray = spritesArray;

    }

    getSpritesArray()
    {
        return this.spritesArray;
    }

    setCurrentSprite( spriteIndex )
    {
        this.spriteIndex = currentSprite;
    }

    getCurrentSpriteNum()
    {
        return this.spriteIndex;
    }

    getCurrentSprite()
    {
        if ( this.spriteIndex < this.spritesArray.length )
        {
            return this.spritesArray[ spriteIndex ];
        }
        else
        {
            return null;
        }
    }

}

module.exports = MultiSprite;