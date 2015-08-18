/* bundleLogger
   ------------
   Provides gulp style logs to the bundle method in browserify.js
*/

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var prettyHrtime = require( 'pretty-hrtime' );
var notifier = require( 'node-notifier' );
var startTime;

module.exports = {
    start: function( filepath )
    {
        startTime = process.hrtime();
        return gutil.log( 'Starting \'' + gutil.colors.cyan.bgBlack( 'browserify' ) + '\'...' );
    },

    watch: function( bundleName )
    {
        return gutil.log( gutil.colors.bgBlack( 'Watching files required by' ), gutil.colors.cyan.bgBlack( bundleName ) );
    },

    end: function( filepath )
    {
        var taskTime = process.hrtime( startTime );
        var prettyTime = prettyHrtime( taskTime );

        gutil.log( 'Finished ', '\'' + gutil.colors.cyan.bgBlack( 'browserify' ) + '\'', ' after', gutil.colors.cyan.bgBlack( prettyTime ) );

        notifier.notify(
        {
            title: 'Browserify',
            message: 'Bundled in ' + prettyTime,
        });
    }
};