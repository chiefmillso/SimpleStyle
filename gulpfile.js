var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        lazy: true
    }),

    // base application configuration
    del = require('del'),
    wiredep = require('wiredep').stream,
    browserSync = require('browser-sync'),
    args = require('yargs').argv,

    // custom plugins for simple style guide
    helper = require('./ssg-core/lib/helper'),
    config = require('./gulp.config'),
    ssgCoreConfig = require('./ssg-core/lib/gen-config'),
    ssgCoreCompile = require('./ssg-core/lib/precomp-pattern');

// Contants
var reload = browserSync.reload;

/// Cleaning up tmp folder
// Clean forlder strucuture and temp folders
gulp.task('clean', function(done) {

    var files2delete = config.tempFiles + '*';

    del(config.tempFiles).then(function() {
        return done();
    });

});

///// Style Configuration
// Styles Sheet compilation
gulp.task('styles', function() {

    var baseStyleOptions = {
        src: 'app/styles/*.scss',
        base: './app/styles/',
    };

    // piping through sass
    return compileStyles(baseStyleOptions);

});

// Styles Sheet compilation
gulp.task('styles:core', function() {

    // logging compiling styles
    helper.logMessage('Compile Core Styles', helper.logType.info);

    var baseStyleOptions = {
        src: 'app/_core/styles/*.scss',
        base: './app/_core/styles/',
    };

    // piping through sass
    return compileStyles(baseStyleOptions);

});
///// Style Configuration End

// Generate index file for all pattern
gulp.task('gen-config', function() {

    var patternPath = config.pattern + '**/*.hbs';
    var curConfig = {
        patterns: patternPath,
        configFile: config.patternConfig
    };

    // parse configuration and log
    gulp.src(patternPath)
        .pipe(ssgCoreConfig(curConfig));

});

// Precompile handle bar templates
gulp.task('precompile:ssg', function() {

    return ssgCoreCompile(config.ssg);

});

gulp.task('precompile:core', function() {

    return ssgCoreCompile(config.core);

});

gulp.task('serve', ['ssgCore', 'styles', 'vet'], function() {

    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp', 'app'],
            routes: {
                '/bower_components': 'bower_components',
                '/tmp': 'app/.tmp'
            }
        },
        https: true
    });

    gulp.watch([
        'app/*.html',
        'app/scripts/**/*.js',
        'app/images/**/*',
        '.tmp/fonts/**/*'
    ]).on('change', reload);

    // Compile Style Sheets
    gulp.watch('app/styles/**/*.scss', ['styles']);
    // handle fonts
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep']);
    // compile templates
    gulp.watch('app/_pattern/*.hbs', ['precompile']);
    gulp.watch(config.js, function() {
        checkJSStyle(config.js);
    });
});


gulp.task('ssgCore', ['styles:core'], function() {

    return gulp.src('app/_core/**/*.js')
        .pipe(gulp.dest('.tmp/'));

});

// Wire up dependencies
gulp.task('wiredep', function() {

    var options = config.getWiredepDefaultOptions();

    gulp.src('app/styles/main.scss')
        .pipe($.plumber())
        .pipe($.print())
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)+/
        }))
        .pipe(gulp.dest('app/styles'));

    gulp.src('app/*.html')
        .pipe($.plumber())
        .pipe($.print())
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./,
            devDependencies: true
        }))
        .pipe(gulp.dest('app'));

});

// inject javascript into file
gulp.task('inject:scripts', function() {

    var options = {
        source: [config.tempFiles + '**/*.js'],
    };

    return inject(options);

});

gulp.task('inject:styles', function() {

    var options = {
        source: [config.tempFiles + '**/*.css'],
    };

    helper.log('Inject Style Sheets', helper.logType.info);

    return inject(options);

});

gulp.task('vet', function() {

    log.Msg('Analyzing source :: Style Guide Mode');

    gulp.watch(config.devjs)
        .on('change', function() {
            checkJSStyle(config.js);
        });

});

gulp.task('vet-dev', function() {

    log.Msg('Analyzing source :: Dev Mode');
    gulp.watch(config.devjs)
        .on('change', function() {
            checkJSStyle(config.devjs);
        });

});
/////////// Reused functions
// check javascript styling conventions
var checkJSStyle = function(files) {

    if (files === undefined || files === null) {
        log.Error('Files is not defined');
        return;
    }

    // pass correct file array in
    gulp.src(files)
        .pipe($.plumber())
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'), {
            verbose: true
        });

};

// Used for inject 
var inject = function(options) {

    // pages to inject files
    var target = gulp.src(config.landingPages);

    // source that needs to be injected
    var sources = gulp.src(options.source, {
        read: false
    });

    return target
        .pipe($.plumber())
        .pipe($.inject(sources, {
            ignorePath: '.tmp'
        }))
        .pipe(gulp.dest(config.basepath));
};
// compile styles and use path
var compileStyles = function(config) {

    // base remove all except sub folder
    var cssPath = '';

    return gulp.src(config.src, {
            base: config.base
        })
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 1 version']
        }))
        .pipe($.sourcemaps.write())
        .pipe($.rename({
            dirname: cssPath
        }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(browserSync.stream());
};

var log = {
    Msg: function(msg) {
        helper.logMessage(msg, helper.logType.info);
    },
    Error: function(msg) {
        helper().logMessage(msg, helper.logType.error);
    },
    Warn: function(msg) {
        helper().logMessage(msg, helper.logType.warning);
    }
};

// compile handlebar patterns
