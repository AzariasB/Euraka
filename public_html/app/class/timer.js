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
        
        console.log("Je pause");
        window.clearTimeout( this.timerId );
        this.remaining -= new Date() - this.start;
    }

    resume()
    {
        console.log("Je commence");
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