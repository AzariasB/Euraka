class Animation
{
    constructor( nbFrame )
    {
        // Sprite animation
        this.frameStart = 1;
        this.frameEnd = nbFrame;
        // this.changeSpriteMax = 20;
        // this.changeSprite = this.changeSpriteMax;
        this.currentFrame = this.frameStart;
        this.lastTime = 0;

        this.reset();

        return;
    }

    getCurrentFrame()
    {
        return this.currentFrame;
    }

    getFrameStart()
    {
        return this.frameStart;
    }

    tick()
    {
        // Si on a plusieurs sprite
        if ( this.frameEnd > 0 )
        {
            this.currentFrame = this.currentFrame + 1;

            if ( this.currentFrame > this.frameEnd )
            {
                this.currentFrame = this.frameStart;
            }
        }

        return;
    }

    setSpeed( speed )
    {
        this.speed = speed;

        return;
    }

    setCount( count, onEndCount )
    {
        this.count = count;
        this.endcount_callback = onEndCount;

        return;
    }

    isTimeToAnimate( time )
    {
        return ( time - this.lastTime ) > this.speed;
    }

    update( time )
    {
        if ( this.lastTime === 0 )
        {
            this.lastTime = time;
        }

        if ( this.isTimeToAnimate( time ) )
        {
            this.lastTime = time;
            this.tick();
            return true;
        }
        else
        {
            return false;
        }
    }

    forceUpdate() 
    {
        this.lastTime = 1;
        return;
    }

    reset() 
    {
        this.lastTime = 0;
        this.currentFrame = this.frameStart;

        return;
    }
}

module.exports = Animation;