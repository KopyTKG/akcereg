#!/bin/bash

# Run the injection script
bun env-entrypoint.cjs

exec "$@"
