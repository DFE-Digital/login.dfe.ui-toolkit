const gulp = require("gulp");
const sass = require("gulp-dart-sass");
const uglify = require("gulp-uglify-es").default;

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const path = require("path");
// const sourcemaps = require("gulp-sourcemaps");
const child = require("child_process");

const through = require("through2");

/**
 * SASS build
 */

const gdsUpgradeSassInput = [
  "./src/gds-upgrade/sass/*.scss",
  "./src/gds-upgrade/sass/pages/*.scss",
];
const gdsUpgradeSassWatch = ["./src/gds-upgrade/sass/**/*.scss"];
const gdsUpgradeOutput = "./dist/gds-upgrade/css/";

const gdsUpgradeSassOptions = {
  errLogToConsole: true,
  outputStyle: "compressed",
  includePaths: ["node_modules/govuk-frontend/dist/govuk/assets"],
};

gulp.task("sass", async () =>
  gulp
    .src(gdsUpgradeSassInput)
    .pipe(sass(gdsUpgradeSassOptions))
    .pipe(gulp.dest(gdsUpgradeOutput)),
);

// /**
//  * Copy some external dependencies
//  */

gulp.task("vendor-scripts", async () => {
  const entries = path.join(
    __dirname,
    "src",
    "gds-upgrade",
    "javascript",
    "vendors.js",
  );
  return (
    browserify(entries)
      .bundle()
      .pipe(source("vendors.min.js"))
      .pipe(buffer())
      // .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      // .pipe(sourcemaps.write("."))
      .pipe(gulp.dest("./dist/gds-upgrade/javascript/vendors/"))
  );
});

gulp.task("copy-js", async () => {
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

// Appends the date/time of the bundle build to help validate whether the browser
// has downloaded the expected version of the bundle i.e. caching (browser/CDN/etc).
function appendDfeIdentifier() {
  const dfeIdentifier = `// ${new Date().toISOString()}`;

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
  browserify("src/gds-upgrade/javascript/app.js")
    .bundle()
    .pipe(source("app.min.js"))
    .pipe(buffer())
    // .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(appendDfeIdentifier())
    // .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/gds-upgrade/javascript/")),
);

/**
 * Copy static assets
 */

gulp.task("copy-assets", async () => {
  gulp
    .src(
      [
        "node_modules/govuk-frontend/dist/govuk/assets/**/*",
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
  gulp.watch(gdsUpgradeSassWatch, gulp.series("sass")).on("change", (event) => {
    console.log(`File ${event} was changed, running tasks...`);
  });
  gulp
    .watch("src/gds-upgrade/javascript/*.js", gulp.series("scripts"))
    .on("change", (event) => {
      console.log(`File ${event} was changed, running tasks...`);
    });
});

// /**
//  * Task definition
//  */

gulp.task(
  "build-gds",
  gulp.series("sass", "scripts", "copy-assets", "vendor-scripts", "copy-js"),
);

gulp.task("run-server", async () => {
  const server = child.spawn("node", ["server.js"]);
  const outputToConsole = (data) => console.log(data.toString());
  server.stdout.on("data", outputToConsole);
  server.stderr.on("data", outputToConsole);
  console.log("server is running...");
});
