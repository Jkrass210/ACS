export const jsOld = () => {
  return app.gulp.src(app.path.src.jsOld, { encoding: false })
    .pipe(app.gulp.dest(app.path.build.js))
}