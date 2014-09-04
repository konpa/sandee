var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths,
    plumber = require("gulp-plumber"),
    concat = require('gulp-concat'),
    clean = require('gulp-clean');


/*
|--------------------------------------------------------------------------
| gulp tasks for dev
|--------------------------------------------------------------------------
|
*/


/*
 * Configure styles task
 */
gulp.task('styles', function () {

    gulp.src("sass/app.scss")
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['styles'].concat(neat),
            errLogToConsole: true
            //sourceComments: 'map',
            //sourceMap: 'sass'
        }))
        .pipe(gulp.dest("public/css/"));

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
        'views/**/*.jade',
        'public/**/*.{css,js}'
    ];

    browserSync.init(files, {
        port: 4000,
        proxy: 'localhost:3000',
        open: false
    });
});


/*
|--------------------------------------------------------------------------
| gulp tasks
|--------------------------------------------------------------------------
|
*/

/*
 * Configure Default task
 */
gulp.task('default',function(){

    gulp.start('styles');
    gulp.start('watch');
    gulp.start('browser-sync');
});
