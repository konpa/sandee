var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths,
    plumber = require("gulp-plumber"),
    concat = require('gulp-concat');

var config = require('./config.json');


/*
 * Configure styles task
 */
gulp.task('styles', function () {

    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['styles'].concat(neat),
            errLogToConsole: true,
            sourceComments: 'map',
            sourceMap: 'sass'
        }))
        .pipe(gulp.dest("./"));

});


/*
 * Configure scripts task
 */
gulp.task('scripts', function () {

    gulp.src([
         "js/app.js"
      ])
        .pipe(plumber())
        .pipe(concat('script.js'))
        .pipe(gulp.dest("./"));

});


/*
 * Configure watch task
 */
gulp.task('watch', function () {

    gulp.watch(["sass/**/*.scss"], ["styles"]);

});


/*
 * Configure Browser sync task
 */
gulp.task('browser-sync', function () {

    var files = [
        './*.{html,css}'
    ];

    browserSync.init(files, {
       server: {
            baseDir: './'
        },
        port: config.port,
        open: false

    });
});


/*
 * Configure Default task
 */
gulp.task('default',function(){

    gulp.start('styles');
    gulp.start('scripts');
    gulp.start('watch');
    gulp.start('browser-sync');
});
