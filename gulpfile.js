const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');



const path = {
  dist: {
    html: 'dist',
    css: 'dist/css',
    js: 'dist/js',
    img: 'dist/img',
    self: 'dist'
  },
  src : {
    html: 'src/*.html',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/*.js',
    img: 'src/img/**/*.**'
  }
};



// FUNCTIONS

const htmlBuild = () => (
  gulp.src(path.src.html)
      .pipe(gulp.dest(path.dist.html))
      .pipe(browserSync.stream())
);

const scssBuild = () => (
  gulp.src(path.src.scss)
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(autoprefixer(['> 0.01%','last 100 versions']))
      .pipe(concat('style.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.dist.css))
      .pipe(browserSync.stream())
);

const jsBuild = () =>(
  gulp.src(path.src.js)
      .pipe(terser())
      .pipe(concat('script.js'))
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(gulp.dest(path.dist.js))
      .pipe(browserSync.stream())
);

const styleReset = () =>(
    gulp.src('src/scss/css/reset.css')
        .pipe(gulp.dest(path.dist.css))
)
// function styleReset() {
//   return src('src/scss/css/reset.css')
//       .pipe(dest('dist/css'));
// }

const imgBuild = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream())
);

const cleanDist = () =>(
  gulp.src(path.dist.self, {allowEmpty: true})
      .pipe(clean())
      .pipe(browserSync.stream())
);


// WATCHERS

const watcher = () =>{
  browserSync.init({
    server:{
      baseDir: "./dist"
    }
  });

  gulp.watch(path.src.html, htmlBuild).on('change', browserSync.reload);
  gulp.watch(path.src.img, imgBuild).on('change', browserSync.reload);
  gulp.watch(path.src.scss, scssBuild).on('change', browserSync.reload);
  gulp.watch(path.src.js, jsBuild).on('change', browserSync.reload);
};

// TASKS
gulp.task('html', htmlBuild);
gulp.task('scss', scssBuild);
gulp.task('js', jsBuild);
gulp.task('img', imgBuild);


gulp.task('dev', gulp.series(styleReset, watcher));

gulp.task('build',gulp.series(
  cleanDist, styleReset,
  gulp.parallel(htmlBuild, imgBuild, scssBuild, jsBuild,)
));



gulp.task('default',gulp.series(
  cleanDist, styleReset,
  gulp.parallel(htmlBuild, imgBuild, scssBuild, jsBuild,),
  watcher
));



//if you cant update your modules use ncu -u