#!/bin/sh

#
# BOOT_MODE is either "env" or "network". This controls how the app discovers
# the private key it needs for the XMTP client.
#

if [ -z $_BOOT_MODE ]; then
  echo "ERROR env.sh :: _BOOT_MODE not set."
  exit 1
fi

export BOOT_MODE=$_BOOT_MODE

#
# KEY_TO_BOOT is the private key that the XMTP client needs. It is only used
# when BOOT_MODE is "env".
#

if [ -z $_KEY_TO_BOOT ]; then
  echo "ERROR env.sh :: _KEY_TO_BOOT not set."
  exit 1
fi

export KEY_TO_BOOT=$_KEY_TO_BOOT

#
# TARGET_URL is the URL of the HTTP API that the XMTP client will forward
# messages to.
#

if [ -z $_TARGET_URL ]; then
  echo "ERROR env.sh :: _TARGET_URL not set."
  exit 1
fi

export TARGET_URL=$_TARGET_URL

#
# TARGET_METHOD is the HTTP method that the XMTP client will use to forward
# messages to the HTTP API.
#

if [ -z $_TARGET_METHOD ]; then
  echo "ERROR env.sh :: _TARGET_METHOD not set."
  exit 1
fi


export TARGET_METHOD=$_TARGET_METHOD

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
# BOOT_CONFIG_FILE_PATH is the path to a file that contains a list of private
# keys. The cache service will serve these private keys to app instances that
# are booting up.

if [ -z $_BOOT_CONFIG_FILE_PATH ]; then
  echo "ERROR env.sh :: _BOOT_CONFIG_FILE_PATH not set. _BOOT_CONFIG_FILE_PATH"
  echo "must point to a file that contains a JSON array of private keys."
  exit 1
fi

export BOOT_CONFIG_FILE_PATH=$_BOOT_CONFIG_FILE_PATH

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