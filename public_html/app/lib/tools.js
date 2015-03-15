/* global exports */

﻿// Data
var config = require( 'data/config.js' );

// Lib
var _ = require( 'underscore' );
var Ractive = require( 'ractive/ractive.runtime.js' );
var $ = require( 'jquery' );
var md5 = require( 'md5' );
var Velocity = require( 'velocity-animate/velocity.js' );
require( 'velocity-animate/velocity.ui.js' );
require( 'lib/raf.js' );

var isDebug = function()
{
    return true;
};
var isLocalhost = function()
{
    return document.URL.indexOf( 'localhost' ) !== -1;
};
var isset = function( v )
{
    return v !== undefined && v !== null;
};

var convertToElement = function( el )
{
    var ele;
    if ( typeof el === 'string' )
    {
        ele = document.getElementById( el );
    }
    else
    {
        ele = el;
    }

    return ele;
};

var show = function( element, callback, options )
{
    var settings = {
        'speed': 600
    };
    settings = _.extend( settings, options );

    var $ele = $( element );
    $ele.stop().show( settings.speed, callback );

    if ( $ele.hasClass( 'is-hide' ) )
    {
        $ele.removeClass( 'is-hide' );
    }

    return;
};

var hide = function( element, callback, options )
{
    var settings = {
        'speed': 800
    };
    settings = _.extend( settings, options );

    $( element ).stop().hide( settings.speed, callback );
    return;
};

var fadeOut = function( el, callback, options )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    var settings = {
        'opacity': 0
    };

    settings = _.extend( settings, options );

    if ( el.classList.contains( 'is-animated' ) === false )
    {
        el.classList.add( 'is-animated' );
        ( function fade()
        {
            if ( ( el.style.opacity -= 0.1 ) < settings.opacity )
            {
                el.classList.add( 'is-hide' );
                el.classList.remove( 'is-animated' );
                if ( isset( callback ) === true )
                {
                    callback();
                }
            }
            else
            {
                window.requestAnimationFrame( fade );
            }
        } )();
    }
};

var fadeIn = function( el, callback, options )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    var settings = {
        'opacity': 1
    };

    settings = _.extend( settings, options );

    el.style.opacity = 0;
    el.style.display = el.style.display || 'block';
    el.classList.remove( 'is-hide' );

    if ( el.classList.contains( 'is-animated' ) === false )
    {
        el.classList.add( 'is-animated' );

        ( function fade()
        {
            var val = parseFloat( el.style.opacity );
            if ( ( ( val += 0.1 ) > settings.opacity ) === false )
            {
                el.style.opacity = val;
                window.requestAnimationFrame( fade );
            }
            else
            {
                el.classList.remove( 'is-animated' );
                if ( isset( callback ) === true )
                {
                    callback();
                }
            }
        } )();
    }

    return;
};

var empty = function( el )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    while ( el.firstChild )
    {
        el.removeChild( el.firstChild );
    }

    return;
};
var getPlatform = function()
{
    var platform = process.platform;
    return /^win/.test( platform ) ? 'win' : /^darwin/.test( platform ) ? 'mac' : 'linux' + ( process.arch == 'ia32' ? '32' : '64' );
};

var log = function( t )
{
    if ( isLocalhost() === false )
    {
        return null;
    }

    if ( typeof t === Object || typeof t === Array )
    {
        console.dir( t );
    }
    else
    {
        console.log( t );
    }
};

var canPlayMP3 = function( audio )
{
    return ( !! audio.canPlayType && audio.canPlayType( 'audio/mpeg; codecs="mp3"' ) !== '' );
};

// Affiche les templates dans le container
var populateTemplate = function( tpl, container, data, callback, partials )
{
    // Ractive.parse( $('#popin-sac').html() );
    // log( tpl + ' ' + container );
    // log( data );
    if ( isset( data ) === false )
    {
        data = {};
    }
    if ( isset( partials ) === false )
    {
        partials = {};
    }

    data.getRandomInt = function( min, max )
    {
        return _.random( min, max );
    };
    data.percent = function( nb, tt )
    {
        return ( nb <= 0 ? 0 : Math.round( 90 * nb / tt, 0 ) );
    };
    data.percentFull = function( nb, tt )
    {
        return ( nb <= 0 ? 0 : Math.round( 100 * nb / tt, 0 ) );
    };

    // Old way
    // We could pass in a string, but for the sake of convenience
    // we're passing the ID of the <script> tag above.
    // template: '#' + tpl,

    return new Ractive(
    {
        // The `el` option can be a node, an ID, or a CSS selector.
        el: container,

        // This will resolve to the parsed template when you bundle up with Browserify.
        // No parsing client-side!
        template: tpl.template,

        // Here, we're passing in some initial data
        data: data,

        partials: partials

    } );
};

var showTemplate = function( tpl, container, data, callback, partials )
{
    // console.trace();
    var ractive = this.populateTemplate( tpl, container, data, callback, partials );

    // Callback après le return
    _.delay( function()
    {
        fadeIn( container, callback );
    }, 100 );

    return ractive;
};

var slideDownTemplate = function( tpl, container, data, callback, partials )
{
    // console.trace();
    var ractive = this.populateTemplate( tpl, container, data, callback, partials );

    // Callback après le return
    _.delay( function()
    {
        slideDown( container, callback );
    }, 100 );

    return ractive;
};

var addSpinner = function( el )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    el.innerHTML = [ '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">',
                '<path fill="#219BD4" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z">',
                '<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25"',
                'dur="1s" repeatCount="indefinite"/>',
                '</path></svg>'
            ].join( '' );

    return;
};

var typeWriter = function( ele, text, n, speed, callback )
{
    if ( n < ( text.length ) )
    {
        ele.html( text.substring( 0, n + 1 ) );
        n++;
        setTimeout( function()
        {
            typeWriter( ele, text, n, speed, callback );
        }, speed );
    }
    else
    {
        if ( isset( callback ) ) callback();
    }
    return;
};

var addClick = function( el, fct )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    return el.addEventListener( 'click', fct, false );
};

var addClickOne = function( el, fct )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return;
    }

    // create event
    el.addEventListener( 'click', function( e )
    {
        // remove event
        e.target.removeEventListener( e.type, arguments.callee );
        // call handler
        return fct( e );
    } );

    return;
};

var addOver = function( el, classImg, classImgOver )
{
    el = convertToElement( el );

    var elClassList = el.classList;

    fctIn = function()
    {
        elClassList.add( classImgOver );
        elClassList.remove( classImg );
    };

    fctOut = function()
    {
        elClassList.add( classImg );
        elClassList.remove( classImgOver );
    };

    el.addEventListener( 'mouseenter', fctIn, false );
    el.addEventListener( 'mouseenter', fctIn, false );
    el.addEventListener( 'mouseout', fctOut, false );
    el.addEventListener( 'mouseleave', fctOut, false );

    return;
};

var removeClick = function( id, fct )
{
    return document.getElementById( id ).removeEventListener( 'click', fct, false );
};

var getTsDay = function()
{

    var n = new Date(),
        s = new Date( n.getFullYear(), n.getMonth(), n.getDate() );

    return s / 1000;
};

/**
 * Retourne un item du tableau au hasard
 */
var tabRandom = function( t )
{
    return t[ Math.floor( Math.random() * t.length ) ];
};

var getDocHeight = function()
{
    return "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
};

var getDocWidth = function()
{
    return "innerWidth" in window ? window.innerWidth : document.documentElement.offsetWidth;
};

var isDesktop = function()
{
    return window.orientation === undefined;
};

var decode = function( file )
{
    // console.log( fs );
    // return window.BISON.decode( fs.readFileSync( file, 'utf8', function ( err, data )
    // {
    //     if ( err )
    //     {
    //         console.log( 'Erreur tools@decode file : ' + file );
    //         return console.log( err );
    //     }
    //     return data;
    // } ) );
};

var ajax = function( url, data, callback, callbackBadChecksum )
{
    var self = this;

    // On save en ligne
    // Send the request
    $.post( config.app.api + url, data, function( response )
    {
        // Checksum ok
        if ( self.verifyChecksum( response.checksum, response.data ) )
        {

            if ( isset( callback ) === true )
            {
                callback( JSON.parse( response.data ) );
            }
        }
        // Checksum bad
        else
        {
            if ( isset( callbackBadChecksum ) === true )
            {
                console.log( 'Error : bad checksum...' );
                callbackBadChecksum( response.data );
            }
        }
    }, 'json' );

    return;
};

var verifyChecksum = function( checksum, data )
{
    return true;
    return checksum === md5.digest_s( data );
};

var toInt = function( n )
{
    return parseInt( n, 10 );
};

var addOverlay = function( callback, options )
{
    var settings = {
        'opacity': 0.9
    }, el;

    settings = _.extend( settings, options );

    el = document.getElementById( 'overlay' );
    el.style.opacity = settings.opacity;

    fadeIn( el, callback, settings );

    return;
};

var removeOverlay = function( callback, options )
{
    var el;

    el = document.getElementById( 'overlay' );

    fadeOut( el, callback );

    return;
};

var slideDown = function( el, callback, options )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return false;
    }

    el.style.opacity = 0;
    el.classList.remove( 'is-hide' );

    Velocity( el, 'stop', true );
    Promise.all( [ Velocity( el, 'transition.slideDownIn' ) ] ).then( function()
    {
        if ( isset( callback ) === true )
        {
            callback();
        }
    } );

    return;

};

var slideUp = function( el, callback, options )
{
    el = convertToElement( el );

    if ( isset( el ) === false )
    {
        return false;
    }

    Velocity( el, 'stop', true );
    Promise.all( [ Velocity( el, 'transition.slideUpOut' ) ] ).then( function()
    {
        el.classList.add( 'is-hide' );

        if ( isset( callback ) === true )
        {
            callback();
        }
    } );

    // Velocity( 'stop', true )
    //     .Velocity( document.getElementById( element ), 'transition.slideUpOut' ).promise().done( callback );

    return;
};
var clapDown = function( callback, options )
{
    var settings = {
        'speed': 600,
        'delay': 0,
        'height': 0,
        'top': 'auto'
    },
        clapTop = convertToElement( 'clapTop' ),
        clapBottom = convertToElement( 'clapBottom' );

    settings = _.extend( settings, options );

    Velocity( clapTop, 'stop', true );
    Velocity( clapBottom, 'stop', true );

    _.delay( function()
    {
        Promise.all( [ Velocity( clapTop, 'transition.bounceDownIn', settings.speed ), Velocity( clapBottom, 'transition.bounceUpIn', settings.speed ) ] ).then( function()
        {
            if ( isset( callback ) === true )
            {
                callback();
            }
        } );

    }, settings.delay );

    return;
};

var clapUp = function( callback, options )
{
    var settings = {
        'speed': 200,
        'delay': 0,
    },
        clapTop = convertToElement( 'clapTop' ),
        clapBottom = convertToElement( 'clapBottom' );

    settings = _.extend( settings, options );

    Velocity( clapTop, 'stop', true );
    Velocity( clapBottom, 'stop', true );

    _.delay( function()
    {
        Promise.all( [ Velocity( clapTop, 'transition.bounceUpOut', settings.speed ), Velocity( clapBottom, 'transition.bounceDownOut', settings.speed ) ] ).then( function()
        {
            if ( isset( callback ) === true )
            {
                callback();
            }
        } );

    }, settings.delay );

    return;
};

// Fusion de fichier json
var merge = function()
{
    'use strict';
    var destination = {},
        sources = [].slice.call( arguments, 0 );
    sources.forEach( function( source )
    {
        var prop;
        for ( prop in source )
        {
            if ( prop in destination && Array.isArray( destination[ prop ] ) )
            {

                // Concat Arrays
                destination[ prop ] = destination[ prop ].concat( source[ prop ] );

            }
            else if ( prop in destination && typeof destination[ prop ] === "object" )
            {

                // Merge Objects
                destination[ prop ] = merge( destination[ prop ], source[ prop ] );

            }
            else
            {

                // Set new values
                destination[ prop ] = source[ prop ];

            }
        }
    } );
    return destination;
};

var ts = function()
{
    return _.now() / 1000;
};

var center = function( el, options )
{
    var settings = {
        'horizontal': true,
        'container': window
    };
    settings = _.extend( settings, options );

    el = convertToElement( el );
    container = settings.container === window ? window : convertToElement( settings.container );

    el.style.position = 'absolute';
    el.style.top = Math.max( 0, ( container.offsetHeight - el.offsetHeight ) / 2 ) + 'px';

    if ( settings.horizontal === true )
    {
        el.style.left = Math.max( 0, ( container.offsetWidth - el.offsetWidth ) / 2 ) + 'px';
    }

    return;
};

//Pour pouvoir situer les éléments les uns par rapport aux autres
var getPositionInArray = function( x,y)
{
    var positions = {
        x:0,
        y:0
    };
    
    positions.x = Math.floor(x/config.map.blockSize);
    positions.y = Math.floor(y/config.map.blockSize);
    
};

exports.getPositionInArry = getPositionInArray;
exports.ts = ts;
exports.removeOverlay = removeOverlay;
exports.addOverlay = addOverlay;
exports.toInt = toInt;
exports.verifyChecksum = verifyChecksum;
exports.ajax = ajax;
exports.decode = decode;
exports.isDesktop = isDesktop;
exports.getDocWidth = getDocWidth;
exports.getDocHeight = getDocHeight;
exports.tabRandom = tabRandom;
exports.getTsDay = getTsDay;
exports.isset = isset;
exports.typeWriter = typeWriter;
exports.hide = hide;
exports.show = show;
exports.fadeIn = fadeIn;
exports.fadeOut = fadeOut;
exports.empty = empty;
exports.addSpinner = addSpinner;
exports.showTemplate = showTemplate;
exports.slideDownTemplate = slideDownTemplate;
exports.populateTemplate = populateTemplate;
exports.canPlayMP3 = canPlayMP3;
exports.isLocalhost = isLocalhost;
exports.isDebug = isDebug;
exports.log = log;
exports.getPlatform = getPlatform;
exports.addClick = addClick;
exports.addClickOne = addClickOne;
exports.addOver = addOver;
exports.removeClick = removeClick;
exports.clapDown = clapDown;
exports.clapUp = clapUp;
exports.slideUp = slideUp;
exports.slideDown = slideDown;
exports.merge = merge;
exports.center = center;
exports.convertToElement = convertToElement;