#!/bin/bash

# Run the injection script
bun env-entrypoint.js

exec "$@"
