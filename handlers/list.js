var assert = require('assert')

module.exports = handler

function handler (opts) {
  assert.equal(typeof opts, 'object', 'handlers/report: opts should be type object')
  assert.equal(typeof opts.db, 'object', 'handlers/report: opts.db should be type object')

  var db = opts.db

  return {
    get: get
  }

  function get (req, res, ctx, done) {
    assert.equal(typeof ctx.query.from, 'string', 'handlers/list.get: ctx.query.from should be type string')
    assert.equal(typeof ctx.query.to, 'string', 'handlers/list.get: ctx.query.to should be type string')

    var lowerBound = Date.parse(ctx.query.from)
    var upperBound = Date.parse(ctx.query.to)

    var dbOpts = {
      gte: lowerBound,
      lte: upperBound
    }

    var rangeStream = db.createReadStream(dbOpts)
    done(null, rangeStream)
  }
}
