class Timer
{
    constructor( callback, delay )
    {
        this.timerId = null;
        this.start = null;
        this.callback = callback;
        this.remaining = delay;

        this.resume();
    }

    pause()
    {
        window.clearTimeout( this.timerId );
        this.remaining -= new Date() - this.start;
    }

    resume()
    {
        this.start = new Date();
        window.clearTimeout( this.timerId );
        this.timerId = window.setTimeout( this.callback, this.remaining );
    }

    addTime( time )
    {
        this.remaining += time;
    }

}

module.exports = Timer;