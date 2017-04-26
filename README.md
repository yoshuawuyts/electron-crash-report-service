<h1 align="center">electron-crash-report-service</h1>

<div align="center">
  <strong>Aggregate crash reports for Electron applications</strong>
</div>

<br />

<div align="center">
  <!-- Stability -->
  <a href="https://nodejs.org/api/documentation.html#documentation_stability_index">
    <img src="https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square"
      alt="API stability" />
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/yoshuawuyts/electron-drash-report-service">
    <img src="https://img.shields.io/travis/yoshuawuyts/electron-drash-report-service/master.svg?style=flat-square"
      alt="Build Status" />
  </a>
  <!-- Standard -->
  <a href="https://codecov.io/github/yoshuawuyts/electron-drash-report-service">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square"
      alt="Standard" />
  </a>
</div>

<br />

## Usage
### Commands
```sh
$ npm install   # Install dependencies
$ npm start     # Start service in development
```

### Client code
```js
var electron = require('electron')

electron.crashReporter.start({
  companyName: '<company-name>',
  productName: '<product-name>',
  submitURL: '<reporter-url>'
})
```

## Environment variables
```sh
PORT [80]                                # Set the port the service should listen to
STORAGE_PATH [/var/crash-reports]  # Location to store crash reports
NODE_ENV [production]                    # production|development
```

## Routes
```txt
/crash-report   POST   Submit a new crash report
/404            GET    404 handler
```

## Peer Dependencies
None

## Unit file
Save the unit file as `/etc/systemd/system/electron-crash-reporter.service`,
and the application image as `/images/electron-crash-report-service.aci`

```unit
[Unit]
Description=electron-crash-report-service
Requires=network-online.target
After=network-online.target

[Service]
Slice=machine.slice
Delegate=true
CPUQuota=10%
MemoryLimit=1G
Environment=PORT=80
Environment=STORAGE_PATH=/var/crash-reports
Environment=NODE_ENV=production
ExecStart=/usr/bin/rkt run --inherit-env /images/electron-crash-report-service.aci
ExecStopPost=/usr/bin/rkt gc --mark-only
KillMode=mixed
Restart=always
```

You can then run it using `systemctl`:
```sh
$ sudo systemctl start etcd.service
$ sudo systemctl stop etcd.service
$ sudo systemctl restart etcd.service
```

## See Also
- [electron/api/crash-reporters](https://github.com/electron/electron/blob/master/docs/api/crash-reporter.md)
- [feross/webtorrent.io](https://github.com/feross/webtorrent.io/blob/master/server/desktop-api.js)

## License
[MIT](https://tldrlegal.com/license/mit-license)
