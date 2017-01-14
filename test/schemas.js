var validator = require('is-my-json-valid')
var read = require('read-directory')
var path = require('path')
var tape = require('tape')

var schemas = read.sync(path.join(__dirname, '../schemas'))

tape('schema-report', function (t) {
  t.test('should validate happy path', function (t) {
    t.plan(1)
    var validate = validator(schemas.report)
    validate({
      error: 'bar',
      timestamp: String(Date.now())
    })
    t.notOk(validate.errors, 'no errors')
  })
})
