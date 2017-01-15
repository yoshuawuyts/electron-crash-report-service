var getPort = require('get-server-port')
var http = require('http')
var tape = require('tape')

var querymw = require('../lib/query-middleware')
var authmw = require('../lib/basic-auth-middleware')
var schema = `
  {
    "required": true,
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "timestamp": {
        "type": "string",
        "required": true,
        "format": "date-time"
      }
    }
  }
`

tape('query middleware', function (t) {
  t.test('should validate input types', function (t) {
    t.plan(1)
    t.throws(querymw.bind(null), /string/)
  })

  t.test('should validate a querystring', function (t) {
    t.plan(3)
    var server = http.createServer(function (req, res) {
      var mw = querymw(schema)
      var ctx = {}
      mw(req, res, ctx, function (err) {
        t.ifError(err)
        t.equal(typeof ctx.query, 'object')
        t.equal(typeof ctx.query.timestamp, 'string')
        res.end()
      })
    })
    server.listen(null, function () {
      var search = '?timestamp=' + (new Date()).toISOString()
      http.get('http://localhost:' + getPort(server) + search, function (req) {
        server.close()
      })
    })
  })
})

tape('basic auth middleware', function (t) {
  t.test('should validate input types', function (t) {
    t.plan(2)
    t.throws(authmw.bind(null), /username/)
    t.throws(authmw.bind(null, 'asdf'), /password/)
  })

  t.test('should allow access if credentials match', function (t) {
    t.plan(1)

    var server = http.createServer(function (req, res) {
      var mw = authmw('foo', 'bar')
      var ctx = {}
      mw(req, res, ctx, function (err) {
        t.ifError(err, 'no err')
        res.end()
      })
    })
    server.listen(null, function () {
      http.get('http://foo:bar@localhost:' + getPort(server), function (req) {
        server.close()
      })
    })
  })

  t.test('should return a 401 if credentials dont match', function (t) {
    t.plan(2)

    var server = http.createServer(function (req, res) {
      var mw = authmw('beep', 'boop')
      var ctx = {}
      mw(req, res, ctx, function (err) {
        t.ok(err, 'err occured')
        t.equal(err.output.statusCode, 401, 'err was a 401')
        res.end()
      })
    })
    server.listen(null, function () {
      http.get('http://foo:bar@localhost:' + getPort(server), function (req) {
        server.close()
      })
    })
  })
})
