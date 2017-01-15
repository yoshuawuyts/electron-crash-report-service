var querymw = require('./lib/query-middleware')
var read = require('read-directory')
var level = require('level')
var merry = require('merry')
var path = require('path')

var notFound = merry.notFound
var mw = merry.middleware
mw.query = querymw

var env = merry.env({
  PORT: 8080,
  DB_PATH: '/tmp/crash-reporter-service',
  USERNAME: String,
  PASSWORD: String
})

var handlers = read.sync(path.join(__dirname, 'handlers'))
var schemas = read.sync(path.join(__dirname, 'schemas'))
var db = level(env.DB_PATH, { valueEncoding: 'json' })

var handlerOpts = { db: db }
var report = handlers.report(handlerOpts)
var list = handlers.list(handlerOpts)
var server = merry()

server.router([
  [ '/report', {
    put: mw([ mw.schema(schemas.report), report.put ])
  } ],
  [ '/list', mw([ mw.query(schemas['list-query']), list.get ]) ],
  [ '/404', notFound() ]
])
server.listen(env.PORT)
