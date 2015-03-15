class Asset
{
    constructor()
    {
        return;
    }

    getPath()
    {
        return this.path;
    }

    getObj()
    {
        return this.obj;
    }

    preload()
    {}

    onLoaded()
    {}

    onError( callback )
    {
        this.obj.addEventListener( 'error', callback, false );

        return;
    }

    checkReadyState( callback )
    {
        // If the video is in the cache of the browser,
        // the 'canplaythrough' event might have been triggered
        // before we registered the event handler.
        if ( this.obj.readyState > 3 )
        {
            callback();
        }

        return;
    }
}

module.exports = Asset;