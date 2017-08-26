'use strict';
var gulp = require('gulp'),

    webserver = require('gulp-webserver'), // Web server
    livereload = require('gulp-livereload'),

    autoprefixer = require('gulp-autoprefixer'), // CSS
    minifycss = require('gulp-clean-css'),
    rename = require('gulp-rename'),

    jshint = require('gulp-jshint'), // JS
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    del = require('del'), // To delete files and directories

    ngAnnotate = require('gulp-ng-annotate'), // For angular stuff
    htmlify = require('gulp-angular-htmlify'),
    minifyHtml = require('gulp-htmlmin'),
    templateCache = require('gulp-angular-templatecache'),

    gulpif = require('gulp-if'), // Filters
    gulpFilter = require('gulp-filter'),
    jsFilter = gulpFilter(['*.module.js', '*.js']),
    cssFilter = gulpFilter('*.css'),

    useref = require('gulp-useref'), // To inject dependencies automatically
    mainBowerFiles = require('main-bower-files'), // To get js bower dependencies into one vendor file on build
    wiredep = require('wiredep').stream, // To get js and css bower dependencies into index.html
    inject = require('gulp-inject'), // To inject custom js and css into index.html

    order = require("gulp-order"), // sort files for injection (used to inject .module in first)

    paths = {
        dev: {
            public: 'app/public/',
            css:   'app/public/css/*.css',
            html:  'app/public/**/*.html',
            js:    ['app/public/js/**/*.module.js', 'app/public/js/**/*.js'],
            images: 'app/public/images/**',
            fonts: 'app/public/fonts',
            bower: 'app/public/bower_components',
            partials: 'app/public/js',
            dev: 'app/public/.tmp'
        },
        build: {
            public: 'dist/public/',
            main: 'dist/',
            js:   'dist/public/js',
            fonts:'dist/public/fonts',
            images: 'dist/public/images'
        },
        app: '/app'
    },

    // Function for watch task to trigger live reload on change
    logWatch = function(event) {
        console.log('File ' + event.path.substring(event.path.indexOf(paths.app)) + ' was ' + event.type);

        livereload.changed();
    },

    // Error function handler
    errorHandler = function(error) {
        console.log(error);
        this.emit('end');
    };

// Web server for development
gulp.task('webserver', ['watch'], function () {
    gulp.src('app/public')
    .pipe(webserver({
        livereload: true,
        port: 4242,
        fallback: 'index.html',
        open: true
    }));
});

// Web server to test the distribution
gulp.task('dist-webserver', function () {
    gulp.src('dist/public')
    .pipe(webserver({
        livereload: true,
        port: 4242,
        fallback: 'index.html',
        open: true
    }));
});

// Initialisation task (run as bower postinstall script)
gulp.task('init', ['templates', 'styles', 'bower', 'fonts'], function () {});

// Default task
gulp.task('default', ['watch', 'webserver'], function () {});

// Watch for changes in html, js and css files
gulp.task('watch', ['templates', 'styles', 'bower', 'fonts'], function() {
    gulp.watch(paths.dev.html, ['templates', 'bower']);
    gulp.watch(paths.dev.js, function (event) {
        // new files must be injected in html
        if (event.type === 'added' || event.type === 'deleted') {
            gulp.start('bower');
        } else {
            // already existing files just need to trigger live reload
            logWatch(event);
        }
    });
    gulp.watch(paths.dev.css, ['styles']).on('change', logWatch);
});

// Build the project for production
gulp.task('build', ['bower-files', 'fonts-dist', 'process-files', 'other-dist', 'images-dist'], function() {
    return gulp.src(paths.dev.js.concat([ '!' + paths.dev.bower + '/**']))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(paths.build.js));
});

// Inject bower components dependencies (js and css), app js and css and html js templates into index.html
gulp.task('bower', ['templates', 'styles'], function () {
    gulp.src('app/public/index.html')
    .pipe(wiredep({}))
    .pipe(inject(gulp.src(paths.dev.js, { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
            return '<script src="' + filePath.replace('app/public/', '') + '"></script>';
        }
    }))
    .pipe(inject(gulp.src([paths.dev.dev + '/css/**/*.css'], { read: false }), {
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
            return '<link rel="stylesheet" href="' + filePath.replace('app/public/', '') + '"/>';
        }
    }))
    .pipe(inject(gulp.src(paths.dev.dev + '/partials/**/*.js', { read: false}), {
        starttag: '<!-- inject:partials -->',
        addRootSlash: false,
        transform: function(filePath, file, i, length) {
            return '<script src="' + filePath.replace('app/public/', '') + '"></script>';
        }
    }))
    .pipe(gulp.dest('app/public/'));
});

// Generate js templates of html partials files
gulp.task('templates', ['empty-tmp-partials'], function (cb) {
  return gulp.src(paths.dev.partials + '/**/*.html')
    .pipe(minifyHtml({}))
    .pipe(templateCache({
        module: 'app',
        transformUrl: function(url) {
            return url.replace(/^js\//, '')
        }
    }))
    .pipe(gulp.dest(paths.dev.dev + '/partials'), cb);
});

// Copy fonts files from dependencies into app fonts folder
gulp.task('fonts', function() { 
    return gulp.src([paths.dev.bower + '/font-awesome/fonts/**.*', paths.dev.bower + '/bootstrap/dist/fonts/**.*']) 
        .pipe(gulp.dest(paths.dev.fonts)); 
});

// Copy images files to build folder
gulp.task('images-dist', function() {
    return gulp.src(paths.dev.images)
        .pipe(gulp.dest(paths.build.images));
});

// Auto-prefix css and outup it into .tmp directory for dev
gulp.task('styles', function(cb) {
    return gulp.src([paths.dev.css, '!./app/public/css/*.dev.css'])
    .pipe(autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(rename({suffix: '.dev'}))
    .pipe(gulp.dest(paths.dev.dev + '/css'), cb);
});

// Jshint not used, but can be run as standalone task
gulp.task('jshint', function() {
    return gulp.src(paths.dev.js.concat(['!' + paths.dev.bower + '/**']))
    .pipe(jshint()).on('error', errorHandler)
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Inject bower js dependencies into dist/index.html, minify and concat into vendor.min.js
gulp.task('bower-files', ['empty-dist'], function() {
    return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest(paths.build.js));
});

// Copy fonts for dist
gulp.task('fonts-dist', ['empty-dist'], function () {
    return gulp.src(paths.dev.fonts + '/*')
    .pipe(gulp.dest(paths.build.fonts));
});

// Copy favicon, 404 and robot.txt in dist directory
gulp.task('other-dist', ['empty-dist'], function () {
    return gulp.src([paths.dev.public + '/favicon.ico', paths.dev.public + '/404.html', paths.dev.public + '/robot.txt'])
    .pipe(gulp.dest(paths.build.public));
});

// Copy html files into build directory, apply html5 data prefix to angular, minify css and inject assets
gulp.task('process-files', ['empty-dist', 'bower-files'], function () {
    return gulp.src('./app/public/index.html')
    .pipe(htmlify())
    .pipe(useref())
    .pipe(gulpif('*.css', minifycss()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulp.dest('dist/public'));
});

// Delete folders tasks
gulp.task('empty-dist', function() {
    del.sync([paths.build.main]);
});

gulp.task('empty-tmp-partials', function() {
    del.sync([paths.dev.dev + '/partials/**', '!' + paths.dev.dev + '/partials']);
});

gulp.task('empty-tmp-css', function() {
    del.sync([paths.dev.dev + '/css/**', '!' + paths.dev.dev + '/css']);
});