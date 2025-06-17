export const fonts = () => {
  return app.gulp.src(app.path.src.slickCscc, { encoding: false })
    .pipe(app.gulp.dest(app.path.build.css))
}