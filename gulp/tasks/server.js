// Config
var config  = require( '../config' ).server;

// Lib
var gulp    = require( 'gulp' );
var connect = require( 'gulp-connect' );

// Lance le serveur web
gulp.task( 'server', function()
{
    return connect.server(
    {
        root: './server/',
        port: config.port,
        livereload: false
    } );
} );