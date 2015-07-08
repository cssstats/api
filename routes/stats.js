var express = require('express')
var router = express.Router()
var httpStatus = require('http-status-codes')
var getCss = require('get-css')
var cssStats = require('cssstats')
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
        res.json({
          stats: cssStats(css.css, {
            specificityGraph: true,
            importantDeclarations: true,
            vendorPrefixedProperties: true,
            propertyResets: true
          })
        })
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

/* GET stats for a url */
router.get('/summary', function (req, res, next) {
  var errors = validateQueryParams(req.query)

  if (isBlank(errors)) {
    var url = normalizeUrl(req.query.url)
    getCss(url)
      .then(function (css) {
        var stats = cssStats(css.css, { importantDeclarations: true })
        var links = css.links.map(function (link) {
          return link.url;
        })

        res.json({
          stats: {
            size: stats.size,
            gzipSize: stats.gzipSize,
            rules: stats.rules.total,
            selectors: stats.selectors.total,
            classSelectors: stats.selectors.class,
            idSelectors: stats.selectors.id,
            typeSelectors: stats.selectors.type,
            specificityMax: stats.selectors.specificity.max,
            specificityAvg: stats.selectors.specificity.average,
            declarations: stats.declarations.total,
            important: stats.declarations.important.length,
            mediaQueries: stats.mediaQueries.total,
            uniqueMediaQueries: stats.mediaQueries.unique,
            links: links
          }
        })
      })
      .catch(function (err) {
        console.log(err)
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
