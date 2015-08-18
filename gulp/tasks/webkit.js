/* Build nw.js
   ---------------
   build-dev : lance le build de nw avec le package.json dev
   build     : lance le build de nw avec le package.json prod
*/

// Config
var config    = require( '../config' ).webkit;

// Package
var gulp      = require('gulp');
var NwBuilder = require( 'node-webkit-builder' );
var replace   = require( 'replace' );

// Task
gulp.task('build-dev', function(callback) {
  // Start nw task with devMode === true
  nwTask(callback, true);
});

gulp.task('build', function(callback) {
  nwTask(callback, false);
});

var nwTask = function( callback, dev )
{
    var manifestWindows = dev === true ? config.manifest.dev : config.manifest.prod;
    var platforms = dev === true ? ['win64'] : config.platforms;

    var nw = new NwBuilder(
    {
        files: config.files, // use the glob format
        cacheDir:config.cacheDir,
        buildDir:config.buildDir,
        platforms: platforms,
        winIco: config.winIco,
        buildType: config.buildType,
        manifest:
        {
            "platformOverrides":
            {
                "window":
                {
                    "fullscreen": manifestWindows.fullscreen,
                    "toolbar": manifestWindows.toolbar,
                    "frame": manifestWindows.frame
                }
            }
        }
    } );

    //Log stuff you want
    nw.on( 'log', console.log );

    // Build returns a promise
    nw.build().then( function()
    {
        console.log( 'all done!' );
    } ).
    catch ( function( error )
    {
        console.error( error );
    } );
};

// var replaceClient = function()
// {
//     console.log( config.dist.prod + config.outputName );
//     return gulp.src( config.dist.prod + config.outputName )
//         .pipe( replace( 'requireClient', 'require' ) );
// };

// gulp.task( 'replaceClient', replaceClient );
// gulp.task( 'nwTask', ['replaceClient'], nwTask );