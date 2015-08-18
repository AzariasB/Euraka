/* Local server task
   ---------------
   connect : lance le serveur
   open    : lance le serveur et ouvre un onglet dans Chromium
*/

// Config
var config = require( '../config' ).connect;

// Lib
var gulp = require( 'gulp' );
var connect = require( 'gulp-connect' );
var gopen = require( 'gulp-open' );

// Task
gulp.task( 'connect', function( callback )
{
    connectTask( callback );
} );

gulp.task( 'open', [ 'connect' ], function( callback )
{
    openTask( callback );
} );

var openTask = function( callback )
{
    var opt = {
        url: config.url + ':' + config.port,
        app: config.app
    };

    return gulp.src( config.src )
        .pipe( open( '<%file.path%>', opt ) );
};

var connectTask = function( callback )
{
    return connect.server(
    {
        root: config.root,
        port: config.port,
        livereload: false
    } );
};