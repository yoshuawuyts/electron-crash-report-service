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

var errors = {
  ENOTFOUND: function (req, res) {
    log.warn('ENOTFOUND', { url: req.url })
    res.statusCode = 404
    return JSON.stringify({
      type: 'invalid_request_error',
      message: 'The route ' + req.url + ' was invalid'
    })
  },
  EREPORTPARSE: function (req, res, err) {
    log.error('EREPORTPARSE', err)
    res.statusCode = 400
    return JSON.stringify({
      type: 'invalid_request_error',
      message: 'Could not parse the crash report upload. Please upload a valid crash report.'
    })
  },
  EREPORTWRITE: function (req, res, err) {
    log.error('EREPORTWRITE', err)
    res.statusCode = 500
    return JSON.stringify({
      type: 'api_error',
      message: 'Internal server error. The report was not saved.'
    })
  }
}

mkdirp.sync(env.CRASH_REPORTS_PATH)

router.route('GET', '/404', function (req, res, ctx) {
  return res.end(errors.ENOTFOUND(req, res))
})

var upload = multer({ DEST: env.CRASH_REPORTS_PATH }).single('upload_file_minidumps')
router.route('POST', '/crash-report', function (req, res, ctx) {
  upload(req, res, function (err) {
    if (err) return res.end(errors.EREPORTPARSE(req, res, err))
    req.body.filename = req.file.filename
    var crashLog = JSON.stringify(req.body, undefined, 2)

    fs.writeFile(req.file.path + '.json', crashLog, function (err) {
      if (err) return res.end(errors.EREPORTWRITE(req, res, err))
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
