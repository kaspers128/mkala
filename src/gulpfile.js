'use strict';

const gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del');


const path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: '../build/',
        css: '../build/css/',
        img: '../build/img/',
        fonts: '../build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: '../src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        css: '../src/css/main.scss',
        img: '../src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: '../src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: '../src/**/*.html',
        css: '../src/css/**/*.scss',
        img: '../src/img/**/*.*',
        fonts: '../src/fonts/**/*.*'
    },
    clean: '../build'
};

function htmlBuild(cb){
    return gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
        cb();
}

function cssBuild(cb){
    return gulp.src(path.src.css) //Выберем файлы по нужному пути
        .pipe(sourcemaps.init()) //Прогоним через rigger
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)); //Выплюнем их в папку build
        cb();
}

function img(cb) {
    return gulp.src(path.src.img)
            .pipe(imagemin({ //Сожмем их
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img));
    cb();
}

function fonts(cb) {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
}

function build(cb) {
    htmlBuild();
    cssBuild();
    img();
    fonts();
    cb();
}

function clean() {
    return del(path.clean, {force: true});
}

// Watch files
function watchFiles() {
    gulp.watch(path.watch.css, cssBuild);
    gulp.watch(path.watch.html, htmlBuild);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.fonts, fonts);
}

// export tasks
exports.clean = clean;
exports.build = build;
exports.watch = watchFiles;
exports.default = gulp.parallel(build, watchFiles);