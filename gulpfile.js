const gulp = require('gulp')
const concat = require('gulp-concat')
const cssmin = require ('gulp-cssmin')
const rename = require ('gulp-rename')
const uglify = require('gulp-uglify')
const image = import('gulp-image').then(mod => mod.default || mod);
const stripJs = require ('gulp-strip-comments')
const stripCss = require('gulp-strip-css-comments')
const htmlmin = require ('gulp-htmlmin')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const sass = require ('gulp-sass')(require('node-sass'))
const {pipe} = require('stdout-stream')
const {contains} = require('jquery') 
const reload = browserSync.reload

function tarefasCSS(cb) {
    
    gulp.src ([
         './node_modules/bootstrap/dist/css/bootstrap.css',
         './asset/vendor/jquery-ui/jquery-ui.css',
         './asset/css/all.min.css',
         './asset/css/meanmenu.css',
         './asset/css/owl.carousel.min.css',
         './asset/vendor/owl/css/owl.css',
         './asset/css/responsive.css',
         './asset/css/style.css'
    ])
        .pipe(stripCss())
        .pipe(concat('libs.css'))
        .pipe (cssmin())
        .pipe (rename({suffix: '.min'})) // libs.min.css
        .pipe(gulp.dest('./dist/css'))
    cb()

        

}
function tarefasSASS(cb){
    gulp.src('./scss/**/*.scss') 
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
    
    cb()
}

function tarefasJS (callback){

    gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './asset/vendor/jquery-mask/jquery.mask.js',
        './asset/vendor/owl/js/owl.js',
        './asset/vendor/jquery-ui/jquery-ui.js'
    
    ])
        .pipe (babel({

            comments: false,
            presets:['@babel/env']

        }))
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'})) // scripts.min.js
        .pipe(gulp.dest('./dist/js'))
    
    return callback()

}
function tarefasImagem(){

    return gulp.src('./src/image/*')
        .pipe(image({
            pngquant:true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg:true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/image'))

    }     
// POC - Proof of Concept
function tarefasHTML(callback){

    gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))

    return callback()

}

gulp.task('serve', function(){

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch('./src/**/*').on('change', process) // repete o processo quando alterar algo em src
    gulp.watch('./src/**/*').on('change', reload)

})

function end(cb){
    console.log("tarefas concluídas")
    return cb()
}

// series x parallel
const process = gulp.series( tarefasHTML, tarefasJS, tarefasCSS, tarefasSASS, end)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem
exports.sass= tarefasSASS

exports.default = process

