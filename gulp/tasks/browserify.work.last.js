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
var configRact   = require( '../config' ).ractiveify;

// Lib
var browserify   = require( 'browserify' );
var factor       = require( 'factor-bundle' );
var watchify     = require( 'watchify' );
var babelify     = require( 'babelify' );
var ractiveify   = require( 'ractiveify' );
var brfs         = require( 'brfs' );
var source       = require( 'vinyl-source-stream' );
var sourcemaps   = require( 'gulp-sourcemaps' );
var buffer       = require( 'vinyl-buffer' );
var bundleLogger = require( '../util/bundleLogger' );
var handleErrors = require( '../util/handleErrors' );
var _            = require( 'lodash' );
var gulp         = require( 'gulp' );
var argv         = require('yargs').argv;

// Task
gulp.task( 'browserify', browserifyTask );

// var production = process.env.NODE_ENV === 'production';

var browserifyTask = function( callback, dev )
{
    var bundleQueue = config.bundleConfigs.length;

    var browserifyThis = function( bundleConfig )
    {
        var dist = dev === true ? config.dist.dev : config.dist.prod,
            outputFiles = bundleConfig.factor,
            sourceName = bundleConfig.sourceName.toString(),
            b, bundle, bundler, rebundle, reportFinished;

        if ( dev )
        {
            // Add watchify args and debug (sourcemaps) option
            _.extend( bundleConfig, watchify.args,
            {
                debug: true
            } );
            // A watchify require/external bug that prevents proper recompiling,
            // so (for now) we'll ignore these options during development
            // bundleConfig = _.omit( bundleConfig, [ 'sourceName', 'factor', 'external', 'require' ] );
            bundleConfig = _.omit( bundleConfig, [ 'external', 'require' ] );
        }

        console.log(bundleConfig);

        b = browserify( bundleConfig );
            // .plugin( factor,
            // {
            //     // File output order must match entry order
            //     o: outputFiles
            // } );

        b.transform( babelify.configure(
        {
            ignore: /(data|lib|nls|templates)/,
        } ) );

        b.transform( configRact, ractiveify );

        bundle = function()
        {
            // Log when bundling starts
            // bundleLogger.start( bundleConfig.outputName );
            bundleLogger.start(  );

            return b
                .bundle()
            // Report compile errors
            .on( 'error', handleErrors )
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe( source( sourceName ) )
            // Specify the output destination
            .pipe( gulp.dest( dist.toString() ) )
                .on( 'end', reportFinished );
        };

        if ( dev )
        {
            // Wrap with watchify and rebundle on changes
            b = watchify( b );
            // Rebundle on update
            b.on( 'update', bundle );
            // bundleLogger.watch( bundleConfig.outputName );
            bundleLogger.watch(  );
        }

        reportFinished = function()
        {
            // Log when bundling completes
            // bundleLogger.end( bundleConfig.outputName );
            bundleLogger.end(  );

            if ( bundleQueue )
            {
                bundleQueue--;
                if ( bundleQueue === 0 )
                {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    };

    // Start bundling with Browserify for each bundleConfig specified
    config.bundleConfigs.forEach( browserifyThis );
};

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;