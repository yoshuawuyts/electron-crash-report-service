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

### Unit file
```service
[Unit]
Description=Container myalpine

[Service]
Environment=NODE_ENV=production
Environment=PORT=8081
Environment=CRASH_REPORTS_PATH=/root/reports
ExecStart=/usr/bin/systemd-nspawn \
  --quiet \
  --keep-unit \
  --boot \
  --link-journal=try-guest \
  --directory=/var/lib/container/electron-crash-reporter-service \
  --network-macvlan=eth0 \
  /usr/bin/env node \
  /usr/root/electron-crash-reporter-service/index.js
KillMode=mixed
Type=notify
RestartForceExitStatus=133
SuccessExitStatus=133

[Install]
WantedBy=multi-user.target
```

## Environment variables
```sh
PORT [80]                                # Set the port the service should listen to
CRASH_REPORTS_PATH [/var/crash-reports]  # Location to store crash reports
NODE_ENV [production]                    # production|development
```

## Routes
```txt
/crash-report   POST   Submit a new crash report
/404            GET    404 handler
```

## Peer Dependencies
None

## See Also
- [electron/api/crash-reporters](https://github.com/electron/electron/blob/master/docs/api/crash-reporter.md)
- [feross/webtorrent.io](https://github.com/feross/webtorrent.io/blob/master/server/desktop-api.js)

## License
[MIT](https://tldrlegal.com/license/mit-license)
