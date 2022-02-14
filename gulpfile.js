

const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const child = require('child_process');

const isDevEnv = process.env.NODE_ENV === 'development';

/**
 * SASS build
 */

const sassInput = ['./src/pre-gds/sass/*.scss', './src/pre-gds/sass/pages/*.scss'];
const output = './dist/css/';

const gdsUpgradeSassInput = ['./src/gds-upgrade/sass/*.scss', './src/gds-upgrade/sass/pages/*.scss'];
const gdsUpgradeSassWatch = ['./src/gds-upgrade/sass/**/*.scss'];
const gdsUpgradeOutput = './dist/gds-upgrade/css/';

const sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk_frontend_toolkit/stylesheets',
    'node_modules/govuk-elements-sass/public/sass'
  ],
};

const gdsUpgradeSassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk-frontend/govuk/assets',
  ],
};

gulp.task('sass', () => gulp
  .src(sassInput)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(output)));

gulp.task('gds-upgrade-sass', () => gulp
  .src(gdsUpgradeSassInput)
  .pipe(sass(gdsUpgradeSassOptions))
  .pipe(gulp.dest(gdsUpgradeOutput)));


/**
 * Copy govuk-template files to dist
 */

gulp.task('copy-minify', () => {
  gulp.src([
    'node_modules/govuk_template_jinja/assets/stylesheets/fonts.css',
    'node_modules/govuk_template_jinja/assets/stylesheets/govuk-template.css',
  ])
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`${output}govuk/`));
});


/**
 * Copy some external dependencies
 */

gulp.task('browserify', () => {
  const entries = path.join(
    __dirname,
    'src',
    'pre-gds',
    'javascript',
    'vendors.js',
  );
  return browserify(entries)
    .bundle()
    .pipe(source('vendors.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/javascript/vendors/'));
});

gulp.task('gds-upgrade-browserify', () => {
  const entries = path.join(
    __dirname,
    'src',
    'gds-upgrade',
    'javascript',
    'vendors.js',
  );
  return browserify(entries)
    .bundle()
    .pipe(source('vendors.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/gds-upgrade/javascript/vendors/'));
});

gulp.task('copy-js', ['browserify'], () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/select2/dist/js/select2.min.js',
  ])
    .pipe(gulp.dest('./dist/javascript/vendors/'));
});

gulp.task('gds-upgrade-copy-js', ['gds-upgrade-browserify'], () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/select2/dist/js/select2.min.js',
  ])
    .pipe(gulp.dest('./dist/gds-upgrade/javascript/vendors/'));
});


/**
 * Build JS script
 */

// script paths
const jsFiles = 'src/pre-gds/javascript/!(vendors)*.js';
const jsDest = 'dist/javascript';
const gdsUpgradeJsFiles = 'src/gds-upgrade/javascript/!(vendors)*.js';
const gdsUpgradeJsDest = 'dist/gds-upgrade/javascript';

gulp.task('scripts', () => gulp.src(jsFiles)
  .pipe(gulpIf(isDevEnv, sourcemaps.init()))
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulpIf(isDevEnv, sourcemaps.write()))
  .pipe(gulp.dest(jsDest)));

gulp.task('gds-upgrade-scripts', () => gulp.src(gdsUpgradeJsFiles)
  .pipe(gulpIf(isDevEnv, sourcemaps.init()))
  .pipe(concat('app.min.js'))
  .pipe(uglify())
  .pipe(gulpIf(isDevEnv, sourcemaps.write()))
  .pipe(gulp.dest(gdsUpgradeJsDest)));


/**
 * Copy static assets
 */

gulp.task('gds-upgrade-copy-assets', () => {
  gulp.src([
    'node_modules/govuk-frontend/govuk/assets/**/*',
    'src/gds-upgrade/assets/**/*',
  ])
    .pipe(gulp.dest('./dist/gds-upgrade/'));
});


/**
 * Watch for changes
 */

gulp.task('watch', () => {
  gulp.watch(sassInput, ['sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
  gulp.watch(jsFiles, ['scripts'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('gds-upgrade-watch', () => {
  gulp.watch(gdsUpgradeSassWatch, ['gds-upgrade-sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
  gulp.watch(gdsUpgradeJsFiles, ['gds-upgrade-scripts'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});


/**
 * Task definition
 */

gulp.task('preGdsBuild', ['sass', 'scripts', 'watch', 'copy-minify', 'copy-js']);
gulp.task('gdsUpgradeBuild', ['gds-upgrade-sass', 'gds-upgrade-scripts', 'gds-upgrade-watch', 'gds-upgrade-copy-js', 'gds-upgrade-copy-assets']);

gulp.task('run-server', ['preGdsBuild', 'gdsUpgradeBuild'], () => {
  const server = child.spawn('node', ['server.js']);
  const outputToConsole = data => console.log(data.toString());
  server.stdout.on('data', outputToConsole);
  server.stderr.on('data', outputToConsole);
});

gulp.task('default', ['preGdsBuild', 'gdsUpgradeBuild']);
