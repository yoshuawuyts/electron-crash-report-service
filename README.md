# crash-reporter-service
Aggregate crash reports for Electron apps

## Usage
```sh
$ npm install   # install dependencies
$ npm start     # start service
```

## Environment variables
```sh
PORT       # set the port the service should listen to
DB_PATH    # set the location the database should be created in
USERNAME   # basic auth username to access results
PASSWORD   # basic auth password to access results
```

## Routes
```txt
/report   PUT   Create a new crash report
/list     GET   Stream out a range of timestamps
/404      GET   404 handler
```

## Peer Dependencies
None

## License
[MIT](https://tldrlegal.com/license/mit-license)
