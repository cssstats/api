var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var stats = require('./routes/stats')
var css = require('./routes/css')
var psi = require('./routes/psi')
var mutations = require('./routes/mutations')

var app = express()


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

var cors = {
  origin: [
    'http://localhost:8080', 'http://cssstats.com', 'https://beta.cssstats.com',
    'http://cssstats-pro.herokuapp.com', 'http://localhost:3000'
  ],
  default: 'http://cssstats.com'
}

app.use(function (req, res, next) {
  var origin = cors.origin.indexOf((req.headers.origin || '').toLowerCase()) > -1 ? req.headers.origin : cors.default

  res.header('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  next()
})

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/stats', stats)
app.use('/css', css)
app.use('/psi', psi)
app.use('/mutations', mutations)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
