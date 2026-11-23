#!/usr/bin/env bash
set -e

if [ -n "$SPEC" ]; then
  ARGS=""
  IFS=',' read -ra FILES <<< "$SPEC"
  for f in "${FILES[@]}"; do
    ARGS="$ARGS --spec ./test/specs/$f"
  done
  npx wdio run wdio.conf.js $ARGS
else
  npx wdio run wdio.conf.js
fi