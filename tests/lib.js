var getPort = require('get-server-port')
var http = require('http')
var tape = require('tape')

var querymw = require('../lib/query-middleware')
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
