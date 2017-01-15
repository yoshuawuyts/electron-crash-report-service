var validator = require('is-my-json-valid')
var read = require('read-directory')
var path = require('path')
var tape = require('tape')

var schemas = read.sync(path.join(__dirname, '../schemas'))

tape('schema-report', function (t) {
  t.test('should pass if a valid object was provided', function (t) {
    t.plan(1)
    var validate = validator(schemas.report)
    validate({
      error: 'bar',
      version: 'v3.0.1',
      timestamp: String(Date.now())
    })
    t.notOk(validate.errors, 'no errors')
  })

  t.test('should fail if no timestamp was provided', function (t) {
    t.plan(2)
    var validate = validator(schemas.report)
    validate({
      error: 'bar',
      version: 'v3.0.1'
    })
    t.ok(validate.errors, 'errors exist')
    var err = validate.errors[0]
    t.equal(err.field, 'data.timestamp')
  })

  t.test('should error out if no error was provided', function (t) {
    t.plan(2)
    var validate = validator(schemas.report)
    validate({
      version: 'v3.0.1',
      timestamp: String(Date.now())
    })
    t.ok(validate.errors, 'errors exist')
    var err = validate.errors[0]
    t.equal(err.field, 'data.error')
  })

  t.test('should error out if no version was provided', function (t) {
    t.plan(2)
    var validate = validator(schemas.report)
    validate({
      error: 'bar',
      timestamp: String(Date.now())
    })
    t.ok(validate.errors, 'errors exist')
    var err = validate.errors[0]
    t.equal(err.field, 'data.version')
  })
})
