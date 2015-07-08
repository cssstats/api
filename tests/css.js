var assert = require('assert')
var request = require('supertest')
var httpStatus = require('http-status-codes')
var app = require('../app.js')

describe('GET /css', function () {

  it('should return the correct data', function (done) {
    request(app)
      .get('/css?url=johnotander.com')
      .expect(function (res) {
        assert.ok(res.body.hasOwnProperty('css'))
      })
      .expect('Content-Type', /json/)
      .expect(httpStatus.OK)
      .end(done)
  })

  it('should return the correct error when there is a problem retrieving CSS', function (done) {
    request(app)
      .get('/css?url=somesitethatismadeup.com')
      .expect(function (res) {
        assert.equal(res.body.message, 'There was an error retrieving the CSS for somesitethatismadeup.com')
      })
      .expect('Content-Type', /json/)
      .expect(httpStatus.UNPROCESSABLE_ENTITY)
      .end(done)
  })

  it('should return the correct error when no url is provided', function (done) {
    request(app)
      .get('/css')
      .expect(function (res) {
        assert.deepEqual(res.body.attributesWithErrors, ['url'])
      })
      .expect('Content-Type', /json/)
      .expect(httpStatus.UNPROCESSABLE_ENTITY)
      .end(done)
  })
})
