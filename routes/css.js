var express = require('express')
var router = express.Router()
var httpStatus = require('http-status-codes')
var getCss = require('get-css')
var isPresent = require('is-present')
var isBlank = require('is-blank')
var normalizeUrl = require('normalize-url')
var isUrl = require('is-url')

var error = require('../utils/error')

/* GET stats for a url */
router.get('/', function (req, res, next) {
  var errors = validateQueryParams(req.query)

  if (isBlank(errors)) {
    var url = normalizeUrl(req.query.url)
    getCss(url)
      .then(function (css) {
        res.json({ css: css })
      })
      .catch(function (err) {
        error.message(
          res,
          httpStatus.UNPROCESSABLE_ENTITY,
          'There was an error retrieving the CSS for ' + req.query.url
        )
      })
  } else {
    error.attributes(res, httpStatus.UNPROCESSABLE_ENTITY, errors)
  }
})

function validateQueryParams (query) {
  if (isBlank(query.url) || !isUrl(normalizeUrl(query.url))) {
    return ['url']
  }
}

module.exports = router
