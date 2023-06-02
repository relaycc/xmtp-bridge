#!/bin/sh

#
# BOOT_MODE is either "env" or "network". This controls how the app discovers
# the private key it needs for the XMTP client.
#
export BOOT_MODE=$_BOOT_MODE

#
# KEY_TO_BOOT is the private key that the XMTP client needs. It is only used
# when BOOT_MODE is "env".
#
export KEY_TO_BOOT=$_KEY_TO_BOOT

#
# TARGET_URL is the URL of the HTTP API that the XMTP client will forward
# messages to.
#
export TARGET_URL=$_TARGET_URL

#
# TARGET_METHOD is the HTTP method that the XMTP client will use to forward
# messages to the HTTP API.
#
export TARGET_METHOD=$_TARGET_METHOD

#
# SENTRY_DSN is used by the Sentry platform to track errors.
#
#
export SENTRY_DSN=$_SENTRY_DSN

#
# BOOT_CONFIG_FILE_PATH is the path to a file that contains a list of private
# keys. The cache service will serve these private keys to app instances that
# are booting up.
export BOOT_CONFIG_FILE_PATH=$_BOOT_CONFIG_FILE_PATH

#
# CACHE_URL is the URL of the cache service.
#
#
export CACHE_URL=$_CACHE_URL

#
# CACHE_PORT is the port of the cache service.
#
#
export CACHE_PORT=$_CACHE_PORT