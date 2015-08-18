/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.

   See browserify in gulp/config.js

   Browserify param doc
   https://github.com/substack/node-browserify#var-b--browserifyfiles-or-opts
*/

// Config
var config       = require( '../config' ).browserify;

// Lib
var browserify   = require( 'browserify' );
var watchify     = require( 'watchify' );
var babelify     = require( 'babelify' );
var brfs         = require( 'brfs' );
var source       = require( 'vinyl-source-stream' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var buffer       = require( 'vinyl-buffer' );
var bundleLogger = require( '../util/bundleLogger' );
var handleErrors = require( '../util/handleErrors' );
var _            = require( 'lodash' );
var gulp         = require( 'gulp' );

// Task
gulp.task( 'browserify', browserifyTask );

// var production = process.env.NODE_ENV === 'production';

var browserifyTask = function( callback, dev )
{
    var dist = dev === true ? config.dist.dev : config.dist.prod,
        b, bundle, bundler, rebundle, reportFinished;

    config = _.omit(config, ['dist']);

    if ( dev )
    {
        // Add watchify args and debug (sourcemaps) option
        _.extend( config, watchify.args,
        {
            debug: true
        } );
        // A watchify require/external bug that prevents proper recompiling,
        // so (for now) we'll ignore these options during development
        config = _.omit(config, ['external', 'require']);
    }

    b = browserify( config );
    b.transform( babelify.configure(
    {
        ignore: /(data|lib)/,
    } ) );
    // b.transform( brfs );

    bundle = function()
    {
        // Log when bundling starts
        bundleLogger.start( config.outputName );

        return b
            .bundle()
            // Report compile errors
            .on( 'error', handleErrors )
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe( source( config.outputName.toString() ) )
            // Specify the output destination
            .pipe( gulp.dest( dist.toString() ) )
            .on( 'end', reportFinished );
    };

    reportFinished = function()
    {
        // Log when bundling completes
        bundleLogger.end( config.outputName );
        // Tell gulp the task is complete.
        callback();
    };

    if ( dev )
    {
        // Wrap with watchify and rebundle on changes
        b = watchify( b );
        // Rebundle on update
        b.on( 'update', bundle );
        bundleLogger.watch( config.outputName.toString() );
    } else {
      // Sort out shared dependencies.
      // b.require exposes modules externally
      if(config.require) b.require(config.require);
      // b.external excludes modules from the bundle, and expects
      // they'll be available externally
      if(config.external) b.external(config.external);
    }

    return bundle();
};

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;