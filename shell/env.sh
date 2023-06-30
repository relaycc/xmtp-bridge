#!/bin/sh

#
# SENTRY_DSN is used by the Sentry platform to track errors.
#
#

if [ -z $_SENTRY_DSN ]; then
  echo "ERROR env.sh :: _SENTRY_DSN not set."
  exit 1
fi

export SENTRY_DSN=$_SENTRY_DSN


#
# CACHE_URL is the URL of the cache service.
#
#

if [ -z $_CACHE_URL ]; then
  echo "ERROR env.sh :: _CACHE_URL not set."
  exit 1
fi

export CACHE_URL=$_CACHE_URL

#
# CACHE_PORT is the port of the cache service.
#
#

if [ -z $_CACHE_PORT ]; then
  echo "ERROR env.sh :: _CACHE_PORT not set."
  exit 1
fi

export CACHE_PORT=$_CACHE_PORT

#
# WEBHOOK_KEY is the address that the webhook server will use to send
# messages to bridge instances.
#

if [ -z $_WEBHOOK_KEY ]; then
  echo "ERROR env.sh :: _WEBHOOK_KEY not set."
  exit 1
fi

export WEBHOOK_KEY=$_WEBHOOK_KEY

#
# CANARY_KEY is the address that the canry server will use to send
# messages to bridge instances.
#

if [ -z $_CANARY_KEY ]; then
  echo "ERROR env.sh :: _CANARY_KEY not set."
  exit 1
fi

export CANARY_KEY=$_CANARY_KEY

#
# The connection string for the project's postgres database.
#
#

if [ -z $_PG_CONNECTION_STRING ]; then
  echo "ERROR :: ./shell/env.sh :: Must set _PG_CONNECTION_STRING"
  exit 1
else
  export PG_CONNECTION_STRING=${_PG_CONNECTION_STRING}
fi

#
# The key we use to authenticate the /signup endpoint
#
#

if [ -z $_SIGNUP_KEY ]; then
  echo "ERROR :: ./shell/env.sh :: Must set _SIGNUP_KEY"
  exit 1
else
  export SIGNUP_KEY=${_SIGNUP_KEY}
fi