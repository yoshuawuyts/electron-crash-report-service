var concat = require('concat-stream')
var bulk = require('bulk-require')
var memdb = require('memdb')
var path = require('path')
var tape = require('tape')
var noop = function () {}

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
        timestamp: String(Date.now()),
        version: 'v3.0.1'
      }
    }
    report.put(null, null, ctx, function (err, val) {
      t.ifError(err, 'no error')
    })
  })
})

tape('list handler', function (t) {
  t.test('should assert input types', function (t) {
    t.plan(4)
    t.throws(handlers.list.bind(null), /object/)
    t.throws(handlers.list.bind(null, {}), /db/)

    var list = handlers.list({ db: memdb() })
    t.throws(list.get.bind(null, {}, {}, {}, noop), /from/)
    var query = { from: '123456' }
    t.throws(list.get.bind(null, {}, {}, { query: query }, noop), /to/)
  })

  t.test('should be able to GET a list of errors', function (t) {
    t.plan(4)

    var yest = (new Date()).toISOString()
    var now = Date.now()
    var tmrw = (new Date()).toISOString()

    var db = memdb({ valueEncoding: 'json' })
    var list = handlers.list({ db: db })
    db.put(now, { some: 'data' }, { sync: true })

    var ctx = {
      query: {
        from: yest,
        to: tmrw
      }
    }
    list.get(null, null, ctx, function (err, stream) {
      t.ifError(err, 'no error')
      var cs = concat({ encoding: 'object' }, function (arr) {
        t.ok(Array.isArray(arr), 'arr is array')
        t.equal(arr.length, 1, '1 entry')
        t.deepEqual(arr[0].value, { some: 'data' })
      })
      stream.pipe(cs)
    })
  })

  t.test('should convert')
})
