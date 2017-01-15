var auth = require('basic-auth')
var assert = require('assert')
var merry = require('merry')

var error = merry.error

module.exports = middleware

function middleware (username, password) {
  assert.equal(typeof username, 'string', 'lib/basic-auth-middleware: username should be type string')
  assert.equal(typeof password, 'string', 'lib/basic-auth-middleware: password should be type string')

  return function (req, res, ctx, done) {
    var creds = auth(req, res)

    if (!creds || creds.name !== username || creds.pass !== password) {
      res.statusCode = 400
      var validationErr = error({
        message: 'invalid credentials',
        statusCode: 401
      })
      return done(validationErr)
    }

    done()
  }
}
