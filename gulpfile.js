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
var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });