/* Watchify
   ---------------
   js       : lance watchify, bundle browserify and watch modifications with devMode === true
   watchify : lance watchify, bundle browserify and watch modifications with devMode === true
*/

var gulp           = require('gulp');
var browserifyTask = require('./browserify.js');

gulp.task('watchify', function(callback) {
  browserifyTask(callback, true);
});
gulp.task('js', function(callback) {
  browserifyTask(callback, true);
});