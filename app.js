var domify = require('domify')
var storageKey = 'dotnetmentor.slide'
var styleKey = storageKey + '.style'
var fs = require('fs')
var glob = require('glob')

glob(__dirname + '/slides/*.html', function (er, files) {
  var slides = []
  files.sort(function (a, b) {
    return n(a) - n(b)
    function n (x) { return +(x.replace(/\D/g, '')) }
  })
  files.forEach(function (file) {
    slides.push(fs.readFileSync(file, 'utf-8').toString())
  })
  load(slides)
})

function load (slides) {
  var slideNumber = parseInt(window.localStorage.getItem(storageKey), 10)
  if (isNaN(slideNumber)) slideNumber = -1
  window.localStorage.removeItem(storageKey)
  var style = JSON.parse(window.localStorage.getItem(styleKey))
  if (style) {
    window.document.body.style.backgroundColor = style.backgroundColor
    window.document.body.style.color = style.color
  }
  onkeypress({keyCode: 'l'.charCodeAt(0)})
  document.onkeypress = onkeypress

  var gotoDetected
  var gotoSlideNumber
  function onkeypress (e) {
    var value = String.fromCharCode(e.keyCode) || ''
    var match = function (x) { return value.match(x) }

    var saveStyle = function () {
      window.localStorage.setItem(styleKey, JSON.stringify({color: document.body.style.color, backgroundColor: document.body.style.backgroundColor}))
    }

    if (match(/b/i)) { document.body.style.color = 'white'; document.body.style.backgroundColor = 'black'; saveStyle(); return }
    if (match(/k/i)) { document.querySelector('img.logo').style.display = 'none'; return }
    if (match(/u/i)) { document.querySelector('img.logo').style.display = 'block'; return }
    if (match(/c/i)) { document.body.style.color = '#17b22a'; document.body.style.backgroundColor = '#202020'; saveStyle(); return }
    if (match(/r/i)) { window.localStorage.setItem(storageKey, slideNumber - 1) ;window.location.reload() }
    if (match(/g/i)) { gotoSlideNumber = ''; gotoDetected = true }
    if (match(/^\d+$/)) { if (gotoDetected) gotoSlideNumber += value }

    if (e.keyCode === 13 && gotoDetected) {
      window.localStorage.setItem(storageKey, parseInt(gotoSlideNumber, 10) - 2) ;window.location.reload()
    }

    if (match('\\?')) {
      document.querySelector('#slide').innerHTML = '<pre style="font-size:20px">' + onkeypress.toString() + '</pre>'
      return
    }
    slideNumber = slideNumber + (match(/h/i) ? -1 : match(/l/i) ? 1 : 0)
    if (slideNumber < 0) slideNumber = 0
    var slide
    while (undefined === (slide = domify(slides[slideNumber]))) --slideNumber
    document.querySelector('#slide').innerHTML = '<h1>' + (slide.getAttribute('data-title') || '') + '</h1>' + slide.innerHTML
    document.querySelector('footer').innerHTML = parseInt(slideNumber, 10) + 1 + '/' + slides.length
  }
}
