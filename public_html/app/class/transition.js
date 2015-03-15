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
        // console.log(this.inProgress);
        // console.log(this.count);
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
                    // console.log( 'this.startValue : ' + this.startValue );
                    // console.log( 'this.endValue : ' + this.endValue );
                    // console.log( 'diff : ' + diff );
                    // console.log( 'currentTime : ' + currentTime );
                    // console.log( 'this.startTime : ' + this.startTime );
                    // console.log( 'elapsed = currentTime - this.startTime : ' + currentTime - this.startTime );
                    // console.log( 'this.duration : ' + this.duration );
                    // console.log( 'this.elapsed : ' + this.elapsed );
                    // console.log( 'i : ' + i );

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