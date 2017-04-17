var serverRouter = require('server-router')
var logHttp = require('log-http')
var envobj = require('envobj')
var mkdirp = require('mkdirp')
var multer = require('multer')
var http = require('http')
var pino = require('pino')
var fs = require('fs')

var config = {
  CRASH_REPORTS_PATH: String,
  NODE_ENV: String,
  PORT: String
}

var env = envobj(config)
var log = pino('http')
var router = serverRouter()
var server = http.createServer(handleRoute)
var stats = logHttp(server)

mkdirp.sync(env.CRASH_REPORTS_PATH)

router.route('GET', '/404', function (req, res, ctx) {
  res.statusCode = 404
  res.end('{ "message": "route not found" }')
})

var upload = multer({ DEST: env.CRASH_REPORTS_PATH }).single('upload_file_minidumps')
router.route('POST', '/crash-report', function (req, res, ctx) {
  upload(req, res, function (err) {
    if (err) {
      log.error('Error parsing crash report: ' + err.message)
      res.status(500)
      return res.end()
    }
    req.body.filename = req.file.filename
    var crashLog = JSON.stringify(req.body, undefined, 2)

    fs.writeFile(req.file.path + '.json', crashLog, function (err) {
      if (err) {
        log.error('Error saving crash report: ' + err.message)
        res.status(500)
      }
      res.end()
    })
  })
})

server.listen(env.PORT, function () {
  log.info(`server started on port ${this.address().port}`)
})
stats.on('data', function (level, data) {
  log[level](data)
})

function handleRoute (req, res) {
  router.match(req, res)
}
