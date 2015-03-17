class Transition
{
    constructor()
    {
        this.startValue = 0;
        this.endValue = 0;
        this.duration = 0;
        this.inProgress = false;

        return;
    }

    start( currentTime, updateFunction, stopFunction, startValue, endValue, duration )
    {
        this.startTime = currentTime;
        this.updateFunction = updateFunction;
        this.stopFunction = stopFunction;
        this.startValue = Math.round( startValue );
        this.endValue = Math.round( endValue );
        this.duration = duration;
        this.inProgress = true;
        this.count = 0;

        return;
    }

    step( currentTime )
    {
        if ( this.inProgress )
        {
            if ( this.count > 0 )
            {
                this.count -= 1;
                console.log( currentTime + ": jumped frame" );
            }
            else
            {
                var elapsed = currentTime - this.startTime;

                if ( elapsed > this.duration )
                {
                    elapsed = this.duration;
                }

                var diff = this.endValue - this.startValue;
                var i = Math.round( this.startValue + ( ( diff / this.duration ) * elapsed ) );

                if ( elapsed === this.duration || i === this.endValue )
                {
                    this.stop();

                    if ( this.stopFunction )
                    {
                        this.stopFunction();
                    }
                }
                else if ( this.updateFunction )
                {
                    this.updateFunction( i );
                }
            }
        }

        return;
    }

    restart( currentTime, startValue, endValue )
    {
        this.start( currentTime, this.updateFunction, this.stopFunction, startValue, endValue, this.duration );
        this.step( currentTime );

        return;
    }

    stop()
    {
        this.inProgress = false;

        return;
    }
}

module.exports = Transition;