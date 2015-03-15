// gulp
// npm i --save-dev browserify watchify brfs 6to5ify vinyl-buffer vinyl-source-stream gulp gulp-browserify gulp-connect gulp-notify gulp-open gulp-rename gulp-require-convert gulp-sourcemaps gulp-uglify gulp-util gulp-jsvalidate require-dir

// A installer
// npm i --save velocity-animate jquery md5 ractive raf underscore
// npm i --save-dev
// npm i --save

// Update npm
// npm install npm -g
// Update local dependencies
// npm update
// Update global dependencies
// npm update -g

// ### This module will attempt to reinstall any missing dependencies. It can be called via the command line or used programmatically.
// ```npm-install-missing```

// ### Find newer versions of dependencies than what your package.json allows
// ```npm-check-updates -u```

/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulp/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
*/

// Require all tasks in gulp/tasks, including subfolders
// var requireDir = require('require-dir');
// requireDir('./gulp/tasks', { recurse: true });
require('./gulp/tasks/browserify.js');
require('./gulp/tasks/connect.js');
require('./gulp/tasks/js.js');
require('./gulp/tasks/server.js');
require('./gulp/tasks/webkit.js');