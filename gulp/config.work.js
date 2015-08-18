var src = './src/';
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
        "entries": src + "app/main.js",
        "paths": [ src + "app/", "./node_modules" ],
        "ignoreMissing": true,
        "insertGlobals": true,
        "outputName": "bundle.js",
        "noParse": ['underscore','jquery','velocity','i18n'],
        "dist":
        {
            "dev": src + "app/",
            "prod": dist + "app/"
        }
    },
    "webkit":
    {
        "files": [
            src + "**/*",
            "!" + src + ".htaccess",
            "!" + src + "changelog.txt",
            "!" + src + "note.md",
            "!" + src + "package.prod.json",
            "!" + src + "page.old.html",
            "!" + src + "class",
            "!" + src + "data",
            "!" + src + "lib",
            "!" + src + "nls",
            "!" + src + "presenters",
            "!" + src + "views",
            "!" + src + "debug.js",
            "!" + src + "main.js"
        ],
        "buildDir": build,
        "cacheDir": build + "cache",
        "winIco": src + "assets/img/favicon/favicon-310.ico",
        "platforms": [ "win", "osx", "linux" ],
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

// browserify: {
// "src": src + "app/main.js",
// "js": src + "app/**/*.js",
// "paths": [ "./node_modules", src + "app/" ],
// "dist":
// {
//     "dev": src + "app/",
//     "prod": dist + "app/"
// },
// "outputName": "bundle.js"
// }