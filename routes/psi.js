var express = require('express')
var router = express.Router()
var httpStatus = require('http-status-codes')
var isPresent = require('is-present')
var isBlank = require('is-blank')
var normalizeUrl = require('normalize-url')
var isUrl = require('is-url')
var psi = require('psi')

var error = require('../utils/error')

/* GET stats for a url */
router.get('/', function (req, res, next) {
  var errors = validateQueryParams(req.query)

  if (isBlank(errors)) {
    psi(req.query.url)
      .then(function (psiData) {
        res.json(psiData)
      })
      .catch(function (err) {
        error.message(
          res,
          httpStatus.UNPROCESSABLE_ENTITY,
          'There was an error retrieving the PSI analytics for ' + req.query.url
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
