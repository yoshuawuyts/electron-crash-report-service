var assert = require('assert')
var merry = require('merry')

var error = merry.error

module.exports = handler

function handler (opts) {
  assert.equal(typeof opts, 'object', 'handlers/report: opts should be type object')
  assert.equal(typeof opts.db, 'object', 'handlers/report: opts.db should be type object')

  var db = opts.db

  return {
    put: put
  }

  function put (req, res, ctx, done) {
    var body = ctx.body
    var key = Date.now()
    db.put(key, body, function (err) {
      if (err) {
        err = error.wrap(err, {
          message: 'Error writing to database',
          statusCode: 500
        })
        return done(err)
      }
      done()
    })
  }
}
