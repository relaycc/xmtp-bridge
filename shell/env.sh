#!/bin/sh

#
# SENTRY_DSN is used by the Sentry platform to track errors.
#
#

export XMTPB_SENTRY_DSN=$_SENTRY_DSN


#
# API_URL is the URL of the cache service.
#
#

export XMTPB_API_URL=$_API_URL

#
# API_PORT is the port of the cache service.
#
#

export XMTPB_API_PORT=$_API_PORT

#
# WEBHOOK_KEY is the address that the webhook server will use to send
# messages to bridge instances.
#

export XMTPB_WEBHOOK_KEY=$_WEBHOOK_KEY

#
# The connection string for the project's postgres database.
#
#

export XMTPB__PG_CONNECTION_STRING=${_PG_CONNECTION_STRING}

#
# The key we use to authenticate the /signup endpoint
#
#

export XMTPB_SIGNUP_KEY=${_SIGNUP_KEY}

#
# The address of the XMTP identity we want to bridge.
#
#

export XMTPB_BRIDGE_ADDRESS=${_BRIDGE_ADDRESS}

#
# VIRTUAL_HOST is the domain name that the bridge will be hosted on.
#
#

export XMTPB_VIRTUAL_HOST=${_VIRTUAL_HOST}

#
# LETSENCRYPT_HOST is the domain name that the bridge will be hosted on.
#
#

export XMTPB_LETSENCRYPT_HOST=${_LETSENCRYPT_HOST}

#
# SSH_HOST is the SSH alias we use to connect to the prod server.
#
#

export XMTPB_SSH_HOST=${_SSH_HOST}

#
# XMTPB_DEFAULT_EMAIL is the email LetsEncrypt will use to contact us about our
# SSL certificates.
#

export XMTPB_DEFAULT_EMAIL=${_DEFAULT_EMAIL}