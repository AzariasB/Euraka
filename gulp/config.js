var src = './public_html/';
var dist = './dist/';
var build = './build/';

// "app": "C:\\Program Files (x86)\\Opera\\launcher.exe",

module.exports = {
    "browserSync":
    {
        "server":
        {
            // Serve up our build folder
            "baseDir": dist
        }
    },
    "connect":
    {
        "app": "C:\\Users\\Administrator\\AppData\\Local\\Chromium\\Application\\chrome.exe",
        "url": "http://localhost",
        "port": 9000,
        "root": src,
        "src": src + "index.html"
    },
    "server":
    {
        "port": 3000
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
                "ignore": ['class/updater.js'],
                "exclude": ['class/updater.js'],
                "external": [
                    'underscore',
                    'ractive/ractive.runtime.js',
                    'jquery',
                    'md5',
                    'velocity-animate/velocity.js',
                    'velocity-animate/velocity.ui.js',
                ],
                "noParse": [
                    'underscore',
                    'ractive/ractive.runtime.js',
                    'jquery',
                    'md5',
                    'velocity-animate/velocity.js',
                    'velocity-animate/velocity.ui.js',

                    'lib/pathfinding/PathFinding.js',
                    'lib/i18n.js',
                    'lib/jquery.booklet.js',
                    'lib/jquery.easing.js',
                    'lib/jquery.knob.js',
                    'lib/jquery.nicescroll.js',
                    'lib/mousetrap.js',
                    'lib/raf.js',
                    'lib/tools.js',

                    'class/updater.js',

                    'data/archetypeData.js',
                    'data/attaqueData.js',
                    'data/config.js',
                    'data/kaodeData.js',
                    'data/objetData.js',
                    'data/terrainData.js',
                    'data/terrainTypeData.js',

                    'data/3/sprites-bibliotheque.json',
                    'data/3/sprites-gui.json',
                    'data/3/sprites-icones.json',
                    'data/3/sprites-kaodes.json',
                    'data/3/sprites-minimaps.json',
                    'data/3/sprites-regions.all.json',
                    'data/3/sprites-regions.json',
                    'data/3/sprites-terrains.json',

                    'data/kaodes/arachniegeData.json',
                    'data/kaodes/cadelleData.json',
                    'data/kaodes/chickenifeData.json',
                    'data/kaodes/eurakaData.json',
                    'data/kaodes/grumplolumpData.json',
                    'data/kaodes/januambrasData.json',
                    'data/kaodes/jaokjelyfData.json',
                    'data/kaodes/mechamosquitoData.json',
                    'data/kaodes/parchenouilleData.json',
                    'data/kaodes/parchenouilleOrangeData.json',
                    'data/kaodes/radioskeeterData.json',
                    'data/kaodes/slimData.json',
                    'data/kaodes/sunkieData.json',
                    'data/kaodes/yelosubData.json',

                    'data/map/demo-starter.js',
                    'data/map/demo.js',
                    'data/map/mallore.js',
                    'data/map/region1.js',
                    'data/map/region2.js',
                    'data/map/region4.js',

                    'nls/accueil.js',
                    'nls/actions.js',
                    'nls/attaquesv2.js',
                    'nls/combat.js',
                    'nls/evenements.js',
                    'nls/items.js',
                    'nls/journal.js',
                    'nls/kaodes.js',
                    'nls/lieux.js',
                    'nls/logs.js',
                    'nls/matos.js',
                    'nls/tuto.js',
                    'nls/ui.js',

                    'templates/mainTpl.ract',
                    'templates/compte/loginTpl.ract',
                    'templates/compte/slotTpl.ract',
                    'templates/game/actionTpl.ract',
                    'templates/game/ambianceTpl.ract',
                    'templates/game/battleEndTpl.ract',
                    'templates/game/battleSelectTpl.ract',
                    'templates/game/battleTpl.ract',
                    'templates/game/bibliothequeTpl.ract',
                    'templates/game/copinouTpl.ract',
                    'templates/game/gameTpl.ract',
                    'templates/game/histoireTpl.ract',
                    'templates/game/popinAmiTpl.ract',
                    'templates/game/popinArchetypeTpl.ract',
                    'templates/game/popinJournalTpl.ract',
                    'templates/game/popinUnlockTpl.ract',
                    'templates/game/partials/battleEnemyTpl.ract',
                    'templates/game/partials/battleKaodeTpl.ract',
                    'templates/game/partials/battleProgressTpl.ract',
                    'templates/game/partials/ficheBibliothequeTpl.ract',
                    'templates/game/partials/ficheKaodeTpl.ract',
                    'templates/game/partials/panelKaodeTpl.ract',
                    'templates/game/partials/statsEditTpl.ract',
                    'templates/game/partials/statsTpl.ract',
                    'templates/intro/archetypeTpl.ract',
                    'templates/intro/compteTpl.ract',
                    'templates/intro/elementTpl.ract',
                    'templates/intro/genreTpl.ract',
                    'templates/intro/introTpl.ract',
                    'templates/menu/menuTpl.ract',
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
        "version": "0.12.0",
        "buildDir": build,
        "cacheDir": build + "cache",
        "winIco": src + "assets/img/favicon/favicon-310.ico",
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