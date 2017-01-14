var bulk = require('bulk-require')
var memdb = require('memdb')
var path = require('path')
var tape = require('tape')

var handlers = bulk(path.join(__dirname, '../'), [ 'handlers/*' ]).handlers

tape('report handler', function (t) {
  t.test('should assert input types', function (t) {
    t.plan(2)
    t.throws(handlers.report.bind(null), /object/)
    t.throws(handlers.report.bind(null, {}), /db/)
  })

  t.test('should be able to PUT an error', function (t) {
    t.plan(1)
    var report = handlers.report({ db: memdb() })
    var ctx = {
      body: {
        error: String(new Error('oh no!')),
        timestamp: String(Date.now())
      }
    }
    report.put(null, null, ctx, function (err, val) {
      t.ifError(err, 'no error')
    })
  })
})
