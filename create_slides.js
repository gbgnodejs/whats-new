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
  fs.writeFileSync('./slides.json', JSON.stringify(slides));
});
