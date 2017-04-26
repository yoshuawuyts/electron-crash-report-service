#!/bin/sh
set -e

id="$(id -u)"
if [ "$id" -ne 0 ]; then
  echo "This script uses functionality which requires root privileges"
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 <output-directory>"
  exit 1
fi

# Set file references
__filename="$(readlink -f "$0")"
__dirname="$(dirname "$__filename")"

# Configuration
VERSION="$(jq -r .version < "${__dirname}/package.json")"
NAME="$(jq -r .name < "${__dirname}/package.json")"
NAME="${NAME}-${VERSION}"
NODE_VERSION="6"
OUTDIR="$1"

# Start acbuild, clean up on exit
acbuild begin "docker://mhart/alpine-node:${NODE_VERSION}"
trap '{ export EXT=$?; acbuild end && exit $EXT; }' EXIT

# Build
acbuild --debug set-name "$NAME"
acbuild --debug set-exec -- /usr/bin/node /var/www/index.js
acbuild --debug run -- apk update
acbuild --debug copy-to-dir "$__dirname"/* /var/www/
acbuild --debug run -- npm install --quiet --production --prefix=/var/www

# Config
acbuild --debug port add http tcp 80
acbuild --debug environment add PORT 80
acbuild --debug environment add NODE_ENV 'production'
acbuild --debug environment add CRASH_REPORTS_PATH '/var/crash-reports'

# Finalize
acbuild --debug write --overwrite "${OUTDIR}/${NAME}.aci"
