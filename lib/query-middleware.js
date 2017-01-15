var validator = require('is-my-json-valid')
var assert = require('assert')
var merry = require('merry')
var url = require('url')

var error = merry.error

module.exports = query

function query (schema) {
  assert.ok(typeof schema === 'string' || typeof schema === 'object', 'lib/query-middleware: schema should be type string or type object')
  var validate = validator(schema)

  return function (req, res, ctx, done) {
    var uri = url.parse(req.url, true)
    var query = uri.query
    validate(query)

    if (validate.errors) {
      res.statusCode = 400
      var validationErr = error({
        message: 'error validating querystring',
        statusCode: 400,
        data: validate.errors
      })
      return done(validationErr)
    }

    ctx.query = query
    done()
  }
}
