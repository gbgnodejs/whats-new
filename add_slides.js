var fs = require('fs');
var glob = require('glob');

glob('./slides/*.html', function(er, files) {
  var slides = [];
  files.sort(function(a, b) {
    return n(a) - n(b);
    function n(x) { return +(x.replace(/\D/g, ''));}
  });
  files.forEach(function(file) {
    slides.push(fs.readFileSync(file, 'utf-8').toString());
  });
  var launchPath = __dirname + '/launch.html';
  var html = fs.readFileSync(launchPath, 'utf8');
  html = html.replace("'#{insert-slides-here}'", JSON.stringify(slides));
  fs.writeFileSync(launchPath, html);
});
