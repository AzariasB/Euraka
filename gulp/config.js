var src = './public_html/';
var dist = './dist/';
var build = './build/';

// "app": "C:\\Program Files (x86)\\Opera\\launcher.exe",

module.exports = {
    "connect":
    {
        "url": "http://localhost",
        "port": 9000,
        "root": src,
        "src": src + "index.html"
    },
    "browserify":
    {
        "bundleConfigs": [
            {
                "entries": [ src + "app/main.js" ],
                "paths": [ src + "app/", "./node_modules" ],
                "ignoreMissing": false,
                "detectGlobals": false,
                "insertGlobals": false,
                "sourceName": "vendor.js",
                "ignore": [],
                "exclude": [],
                "external": [],
                "noParse": [
                    'underscore',
                    'ractive/ractive.runtime.js',

                    'lib/mousetrap.js',
                    'lib/raf.js',
                    'lib/tools.js',

                    'data/stages/pyramide2-2a.js',
                    'data/stages/pyramide2-1a.js',
                    'data/stages/grotte1-2a.js',
                    'data/stages/tuto.js',
                    'data/stages/grotte1-1a.js',
                    'data/sprites-keys.json',
                    'data/config.js',
                    'data/stageData.js',
                    'data/sprites-ui.json',
                    'data/sprites-game.json',

                    'views/game/gameTpl.ract',
                    'views/game/cinematiqueTpl.ract',
                    'views/game/deathTpl.ract',
                    'views/game/minimapTpl.ract',
                    'views/game/scoringTpl.ract',
                    'views/game/cinematiqueGameTpl.ract',
                    'views/game/cinematiqueKaodeTpl.ract',
                    'views/game/cinematiqueCreditTpl.ract',
                    'views/intro/toucheTpl.ract',
                    'views/intro/accueilTpl.ract',
                    'views/intro/creditTpl.ract'
                ]
    }],
        "dist":
        {
            "dev": src + "app/bundle/",
            "prod": dist + "app/bundle/"
        }
    },
    "ractiveify":
    {
        "paths": [ src + "app/templates/**/*.ract" ],
        'extension': '.ract'
    },
    "webkit":
    {
        "files": [
            src + "app/bundle/**/*",
            src + "assets/audio/**/*.ogg",
            src + "assets/css/**/*",
            src + "assets/font/**/*",
            src + "assets/img/**/*",
            src + "assets/js/**/*",
            src + "index.html",
            src + "package.json"
        ],
        "version": "0.12.3",
        "buildDir": build,
        "cacheDir": build + "cache",
        "winIco": src + "assets/img/favicon/icon.ico",
        "buildType": 'versioned',
        "platforms": [ "win64", "osx64", "linux64" ],
        "manifest":
        {
            "dev":
            {
                "fullscreen": false,
                "toolbar": true,
                "frame": true
            },
            "prod":
            {
                "fullscreen": true,
                "toolbar": false,
                "frame": false
            }
        }
    },
    "production":
    {
        "cssSrc": dist + "/*.css",
        "jsSrc": dist + "/*.js",
        "dest": dist
    }
};

/* browserify factor plugin
   ---------------
   Avoir un fichier "common" commun à un ensemble de fichier.
   Ne fonctionne pas avec Watchify

   "entries": [ src + "app/lib.js", src + "app/main.js" ],
   "factor": [ src + "app/bundle/lib.js", src + "app/bundle/main.js" ],

*/