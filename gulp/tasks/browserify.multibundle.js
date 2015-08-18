/**
 * Use Browserify to bundle scripts.
 */

/* Load modules */
var src          = './src/';
var bundleLogger = require( '../util/bundleLogger' );
var handleErrors = require( '../util/handleErrors' );

var gulp         = require( 'gulp' );
var fs           = require( 'fs' );
var browserify   = require( 'browserify' );
var watchify     = require( 'watchify' );
var source       = require( "vinyl-source-stream" );
var argv         = require( 'yargs' ).argv;

var watchify     = require( 'watchify' );
var babelify     = require( 'babelify' );
var ractiveify   = require( 'ractiveify' );

/**
* Watch flag used in Watchify.
*
* @type {boolean}
*/
var isWatch      = argv.watch;

/**
 * List of libraries or modules that should be exposed outside of its bundle.
 *
 * These files will be bundled to single `common.js` file. It can be referenced
 * from other files by simply requiring the module.
 *
 * @type {Array}
 */

var vendors = [
    {
        require: 'underscore',
        expose: 'underscore'
        },
    {
        require: 'ractive/ractive.runtime.js',
        expose: 'ractive/ractive.runtime.js'
        },
    {
        require: 'jquery',
        expose: 'jquery'
        },
    {
        require: 'md5',
        expose: 'md5'
        },
    {
        require: 'velocity-animate/velocity.js',
        expose: 'velocity-animate/velocity.js'
        },
    {
        require: 'velocity-animate/velocity.ui.js',
        expose: 'velocity-animate/velocity.ui.js'
        },
    {
        require: 'lib/pathfinding/PathFinding.js',
        expose: 'lib/pathfinding/PathFinding.js'
        },
    {
        require: 'lib/i18n.js',
        expose: 'lib/i18n.js'
        },
    {
        require: 'lib/jquery.booklet.js',
        expose: 'lib/jquery.booklet.js'
        },
    {
        require: 'lib/jquery.easing.js',
        expose: 'lib/jquery.easing.js'
        },
    {
        require: 'lib/jquery.knob.js',
        expose: 'lib/jquery.knob.js'
        },
    {
        require: 'lib/jquery.nicescroll.js',
        expose: 'lib/jquery.nicescroll.js'
        },
    {
        require: 'lib/mousetrap.js',
        expose: 'lib/mousetrap.js'
        },
    {
        require: 'lib/raf.js',
        expose: 'lib/raf.js'
        }
    ];

var libs = [
    {
        require: 'data/archetypeData.js',
        expose: 'data/archetypeData.js'
        },
    {
        require: 'data/attaqueData.js',
        expose: 'data/attaqueData.js'
        },
    {
        require: 'data/config.js',
        expose: 'data/config.js'
        },
    {
        require: 'data/kaodeData.js',
        expose: 'data/kaodeData.js'
        },
    {
        require: 'data/objetData.js',
        expose: 'data/objetData.js'
        },
    {
        require: 'data/terrainData.js',
        expose: 'data/terrainData.js'
        },
    {
        require: 'data/terrainTypeData.js',
        expose: 'data/terrainTypeData.js'
        },

    {
        require: 'data/3/sprites-bibliotheque.json',
        expose: 'data/3/sprites-bibliotheque.json'
        },
    {
        require: 'data/3/sprites-gui.json',
        expose: 'data/3/sprites-gui.json'
        },
    {
        require: 'data/3/sprites-icones.json',
        expose: 'data/3/sprites-icones.json'
        },
    {
        require: 'data/3/sprites-kaodes.json',
        expose: 'data/3/sprites-kaodes.json'
        },
    {
        require: 'data/3/sprites-minimaps.json',
        expose: 'data/3/sprites-minimaps.json'
        },
    {
        require: 'data/3/sprites-regions.all.json',
        expose: 'data/3/sprites-regions.all'
        },
    {
        require: 'data/3/sprites-regions.json',
        expose: 'data/3/sprites-regions.json'
        },
    {
        require: 'data/3/sprites-terrains.json',
        expose: 'data/3/sprites-terrains.json'
        },

    {
        require: 'data/kaodes/arachniegeData.json',
        expose: 'data/kaodes/arachniegeData.json'
        },
    {
        require: 'data/kaodes/cadelleData.json',
        expose: 'data/kaodes/cadelleData.json'
        },
    {
        require: 'data/kaodes/chickenifeData.json',
        expose: 'data/kaodes/chickenifeData.json'
        },
    {
        require: 'data/kaodes/eurakaData.json',
        expose: 'data/kaodes/eurakaData.json'
        },
    {
        require: 'data/kaodes/grumplolumpData.json',
        expose: 'data/kaodes/grumplolumpData.json'
        },
    {
        require: 'data/kaodes/januambrasData.json',
        expose: 'data/kaodes/januambrasData.json'
        },
    {
        require: 'data/kaodes/jaokjelyfData.json',
        expose: 'data/kaodes/jaokjelyfData.json'
        },
    {
        require: 'data/kaodes/mechamosquitoData.json',
        expose: 'data/kaodes/mechamosquitoData.json'
        },
    {
        require: 'data/kaodes/parchenouilleData.json',
        expose: 'data/kaodes/parchenouilleData.json'
        },
    {
        require: 'data/kaodes/parchenouilleOrangeData.json',
        expose: 'data/kaodes/parchenouilleOrangeData.json'
        },
    {
        require: 'data/kaodes/radioskeeterData.json',
        expose: 'data/kaodes/radioskeeterData.json'
        },
    {
        require: 'data/kaodes/slimData.json',
        expose: 'data/kaodes/slimData.json'
        },
    {
        require: 'data/kaodes/sunkieData.json',
        expose: 'data/kaodes/sunkieData.json'
        },
    {
        require: 'data/kaodes/yelosubData.json',
        expose: 'data/kaodes/yelosubData.json'
        },

    {
        require: 'data/map/demo-starter.js',
        expose: 'data/map/demo-starter.js'
        },
    {
        require: 'data/map/demo.js',
        expose: 'data/map/demo.js'
        },
    {
        require: 'data/map/mallore.js',
        expose: 'data/map/mallore.js'
        },
    {
        require: 'data/map/region1.js',
        expose: 'data/map/region1.js'
        },
    {
        require: 'data/map/region2.js',
        expose: 'data/map/region2.js'
        },
    {
        require: 'data/map/region4.js',
        expose: 'data/map/region4.js'
        }
    ];

var externals = [].concat( vendors, libs );

/**
 * Set of files to bundle.
 *
 * Each obj within this array will be bundles separately.
 *
 * @type {Array}
 */
var files = [
    {
        input: vendors,
        output: 'common.js',
        destination: './src/app/bundle/',
        require: true
  },
    {
        input: libs,
        output: 'lib.js',
        destination: './src/app/bundle/',
        require: true
  },
    {
        input: [ './src/app/main.js' ],
        output: 'main.js',
        destination: './src/app/bundle/'
  }
 ];

var configRact   = require( '../config' ).ractiveify;
var configGenerale = {
    "paths": [ src + "app/", "./node_modules" ],
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
                    'lib/tools.js'
                ]
}

/**
 * Defer object to handle task ending.
 *
 * After all of the bundle is comlete, it will execute callback of gulp task
 * so that other task can wait until the task ends.
 *
 * @param {int}      max      Max number of how many call should Defer wait
 *                            until executing callback.
 * @param {Function} callback Callback of Gulp task.
 */
var Defer = function( max, callback )
{
    this.max = max;
    this.count = 0;
    this.callback = callback;

    this.exec = function()
    {
        if ( this.max === ++this.count )
        {
            this.callback();
        }
    };
};

/**
 * Bundle given file.
 */
var bundle = function( bundler, options )
{
    startTime = new Date().getTime();
    bundleLogger.start( options.output );

    return bundler.bundle()
        .on( 'error', handleErrors)
        .pipe( source( options.output ) )
        .pipe( gulp.dest( options.destination ) )
        .on( 'end', function()
        {
            bundleLogger.end( options.output );
            time = ( new Date().getTime() - startTime ) / 1000;
            console.log( options.output + ' was browserified: ' + time + 's' );
        } );
}

/**
 * Create bundle properties such as if its is added or required etc.
 */
var createBundleProp = function( b, options )
{
    var bundler = b;

    var i = 0;
    for ( i; i < options.input.length; i++ )
    {
        if ( options.require )
        {
            bundler.require( options.input[ i ].require,
            {
                expose: options.input[ i ].expose
            } );
        }
        else
        {
            bundler.add( options.input[ i ] );

            externals.forEach( function( external )
            {
                bundler.external( external.expose );
            } );
        }
    };

    return bundler;
};

/**
 * Create single bundle using files options.
 */
var createBundle = function( options, d )
{
    var bundler = browserify(
    {
        paths: configGenerale.paths,
        noParse: configGenerale.noParse,
        cache:
        {},
        packageCache:
        {},
        fullPaths: false
    } );

    bundler = createBundleProp( bundler, options );

    bundler.transform( babelify.configure(
    {
        ignore: /(data|lib|nls|templates)/,
    } ) );

    bundler.transform( configRact, ractiveify );

    if ( isWatch )
    {
        bundler = watchify( bundler );
        bundler.on( 'update', function()
        {
            bundle( bundler, options );
        } );
    }

    return bundle( bundler, options );
};

/**
 * Create set of bundles.
 */
var createBundles = function( bundles, defer )
{
    bundles.forEach( function( bundle )
    {
        createBundle( bundle ).on( 'end', function()
        {
            defer.exec();
        } );
    } );
};

/**
 * Browserify task. If `--watch` option is passed, watchify will activate.
 */
gulp.task( 'browserify', function( done )
{
    var d = new Defer( files.length, done );

    if ( argv.watch )
    {
        isWatch = true;
    }

    createBundles( files, d );
} );