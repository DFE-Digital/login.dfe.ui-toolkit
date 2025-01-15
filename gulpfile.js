const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCSS = require("gulp-clean-css");

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const child = require("child_process");

const through = require("through2");

const isDevEnv = process.env.NODE_ENV === "development";
console.log("Dev environment = ", isDevEnv);

/**
 * SASS build
 */

const sassInput = [
  "./src/pre-gds/sass/*.scss",
  "./src/pre-gds/sass/pages/*.scss",
];
const output = "./dist/css/";

const gdsUpgradeSassInput = [
  "./src/gds-upgrade/sass/*.scss",
  "./src/gds-upgrade/sass/pages/*.scss",
];
const gdsUpgradeSassWatch = ["./src/gds-upgrade/sass/**/*.scss"];
const gdsUpgradeOutput = "./dist/gds-upgrade/css/";

const sassOptions = {
  errLogToConsole: true,
  outputStyle: "compressed",
  includePaths: [
    "node_modules/govuk_frontend_toolkit/stylesheets",
    "node_modules/govuk-elements-sass/public/sass",
  ],
};

const gdsUpgradeSassOptions = {
  errLogToConsole: true,
  outputStyle: "compressed",
  includePaths: ["node_modules/govuk-frontend/govuk/assets"],
};

gulp.task("sass", async () =>
  gulp.src(sassInput).pipe(sass(sassOptions)).pipe(gulp.dest(output)),
);

gulp.task("gds-upgrade-sass", async () =>
  gulp
    .src(gdsUpgradeSassInput)
    .pipe(sass(gdsUpgradeSassOptions))
    .pipe(gulp.dest(gdsUpgradeOutput)),
);

/**
 * Copy govuk-template files to dist
 */

gulp.task("copy-minify", async () => {
  gulp
    .src([
      "node_modules/govuk_template_jinja/assets/stylesheets/fonts.css",
      "node_modules/govuk_template_jinja/assets/stylesheets/govuk-template.css",
    ])
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(`${output}govuk/`));

  gulp
    .src(["node_modules/govuk_template_jinja/assets/stylesheets/fonts/**/*"], {
      encoding: false,
    })
    .pipe(gulp.dest(`${output}govuk/fonts`));
});

// /**
//  * Copy some external dependencies
//  */

gulp.task("browserify", async () => {
  const entries = path.join(
    __dirname,
    "src",
    "pre-gds",
    "javascript",
    "vendors.js",
  );
  return browserify(entries)
    .bundle()
    .pipe(source("vendors.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./dist/javascript/vendors/"));
});

gulp.task("gds-upgrade-browserify", async () => {
  const entries = path.join(
    __dirname,
    "src",
    "gds-upgrade",
    "javascript",
    "vendors.js",
  );
  return browserify(entries)
    .bundle()
    .pipe(source("vendors.min.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./dist/gds-upgrade/javascript/vendors/"));
});

gulp.task("copy-js", async () => {
  gulp
    .src([
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/select2/dist/js/select2.min.js",
    ])
    .pipe(gulp.dest("./dist/javascript/vendors/"));
});

gulp.task("gds-upgrade-copy-js", async () => {
  gulp
    .src([
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/select2/dist/js/select2.min.js",
    ])
    .pipe(gulp.dest("./dist/gds-upgrade/javascript/vendors/"));
});

// /**
//  * Build JS script
//  */

// script paths
const jsFiles = "src/pre-gds/javascript/!(vendors)*.js";
const jsDest = "dist/javascript";
const gdsUpgradeJsFiles = "src/gds-upgrade/javascript/!(vendors)*.js";
const gdsUpgradeJsDest = "dist/gds-upgrade/javascript";

// appendDfeIdentifier appends a variable 'dfeIdentifier' to the bundle output.
// Within browser tools -> console, type 'dfeIdentifier' which will then return
// the date/time of the bundle build. Helps validate whether the browser has
// downloaded the expected version of the bundle i.e. caching (browser/CDN/etc)
function appendDfeIdentifier() {
  const dfeIdentifier = `const dfeIdentifier = '${new Date().toISOString()}';`;

  function transform(file, encoding, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }
    const dfeIdentifierBuffer = Buffer.from(dfeIdentifier);
    file.contents = Buffer.concat([file.contents, dfeIdentifierBuffer]);

    cb(null, file);
  }

  return through.obj(transform);
}

gulp.task("scripts", async () =>
  gulp
    .src(jsFiles)
    .pipe(gulpIf(isDevEnv, sourcemaps.init()))
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(gulpIf(isDevEnv, sourcemaps.write()))
    .pipe(gulp.dest(jsDest)),
);

gulp.task("gds-upgrade-scripts", async () =>
  gulp
    .src(gdsUpgradeJsFiles)
    .pipe(gulpIf(isDevEnv, sourcemaps.init()))
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(appendDfeIdentifier())
    .pipe(gulpIf(isDevEnv, sourcemaps.write()))
    .pipe(gulp.dest(gdsUpgradeJsDest)),
);

/**
 * Copy static assets
 */

gulp.task("gds-upgrade-copy-assets", async () => {
  gulp
    .src(
      [
        "node_modules/govuk-frontend/govuk/assets/**/*",
        "src/gds-upgrade/assets/**/*",
      ],
      { encoding: false },
    )
    .pipe(gulp.dest("./dist/gds-upgrade/"));
});

/**
 * Watch for changes
 */

gulp.task("watch", async () => {
  gulp.watch(sassInput, gulp.series("sass")).on("change", (event) => {
    console.log(`File ${event} was changed, running tasks...`);
  });
  gulp.watch(jsFiles, gulp.series("scripts")).on("change", (event) => {
    console.log(`File ${event} was changed, running tasks...`);
  });
});

gulp.task("gds-upgrade-watch", async () => {
  gulp
    .watch(gdsUpgradeSassWatch, gulp.series("gds-upgrade-sass"))
    .on("change", (event) => {
      console.log(`File ${event} was changed, running tasks...`);
    });
  gulp
    .watch(gdsUpgradeJsFiles, gulp.series("gds-upgrade-scripts"))
    .on("change", (event) => {
      console.log(`File ${event} was changed, running tasks...`);
    });
});

// /**
//  * Task definition
//  */

gulp.task(
  "preGdsBuild",
  gulp.series("sass", "scripts", "copy-minify", "copy-js", "browserify"),
);
gulp.task(
  "gdsUpgradeBuild",
  gulp.series(
    "gds-upgrade-sass",
    "gds-upgrade-scripts",
    "gds-upgrade-copy-assets",
    "gds-upgrade-browserify",
    "gds-upgrade-copy-js",
  ),
);

gulp.task("run-server", async () => {
  const server = child.spawn("node", ["server.js"]);
  const outputToConsole = (data) => console.log(data.toString());
  server.stdout.on("data", outputToConsole);
  server.stderr.on("data", outputToConsole);
  console.log("server is running...");
});

gulp.task("build-gds", gulp.series("preGdsBuild", "gdsUpgradeBuild"));
