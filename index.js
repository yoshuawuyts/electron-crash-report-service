var authmw = require('./lib/basic-auth-middleware')
var querymw = require('./lib/query-middleware')
var read = require('read-directory')
var bulk = require('bulk-require')
var level = require('level')
var merry = require('merry')
var path = require('path')

var notFound = merry.notFound
var mw = merry.middleware

var env = merry.env({
  PORT: 8080,
  DB_PATH: '/tmp/crash-reporter-service',
  USERNAME: String,
  PASSWORD: String
})

var handlers = bulk(__dirname, [ 'handlers/*' ]).handlers
var schemas = read.sync(path.join(__dirname, 'schemas'))
var db = level(env.DB_PATH, { valueEncoding: 'json' })

var handlerOpts = { db: db }
var authenticate = authmw(env.USERNAME, env.PASSWORD)
var report = handlers.report(handlerOpts)
var list = handlers.list(handlerOpts)
var server = merry()

server.router([
  [ '/report', {
    put: mw([ mw.schema(schemas.report), report.put ])
  } ],
  [ '/list', mw([ authenticate, querymw(schemas['list-query']), list.get ]) ],
  [ '/404', notFound() ]
])
server.listen(env.PORT)
