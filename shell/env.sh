#!/bin/sh

#
# SENTRY_DSN is used by the Sentry platform to track errors.
#
#

export XMTPB_SENTRY_DSN=${_XMTPB_SENTRY_DSN}


#
# API_URL is the URL of the cache service.
#
#

export XMTPB_API_URL=${_XMTPB_API_URL}

#
# API_PORT is the port of the cache service.
#
#

export XMTPB_API_PORT=${_XMTPB_API_PORT}

#
# WEBHOOK_KEY is the address that the webhook server will use to send
# messages to bridge instances.
#

export XMTPB_WEBHOOK_KEY=${_XMTPB_WEBHOOK_KEY}

#
# The connection string for the project's postgres database.
#
#

export XMTPB_PG_CONNECTION_STRING=${_XMTPB_PG_CONNECTION_STRING}

#
# The key we use to authenticate the /signup endpoint
#
#

export XMTPB_SIGNUP_KEY=${_XMTPB_SIGNUP_KEY}

#
# The address of the XMTP identity we want to bridge.
#
#

export XMTPB_BRIDGE_ADDRESS=${_XMTPB_BRIDGE_ADDRESS}

#
# VIRTUAL_HOST is the domain name that the bridge will be hosted on.
#
#

export XMTPB_VIRTUAL_HOST=${_XMTPB_VIRTUAL_HOST}

#
# LETSENCRYPT_HOST is the domain name that the bridge will be hosted on.
#
#

export XMTPB_LETSENCRYPT_HOST=${_XMTPB_LETSENCRYPT_HOST}

#
# SSH_HOST is the SSH alias we use to connect to the prod server.
#
#

export XMTPB_SSH_HOST=${_XMTPB_SSH_HOST}

#
# XMTPB_DEFAULT_EMAIL is the email LetsEncrypt will use to contact us about our
# SSL certificates.
#

export XMTPB_DEFAULT_EMAIL=${_XMTPB_DEFAULT_EMAIL}

#
# XMTPB_IMAGE_TAG is the docker image tag to use for everything.
#
#

export XMTPB_IMAGE_TAG=${_XMTPB_IMAGE_TAG}

#
# XMTPB_POSTGRES_USER is the postgres user to use for the postgres database.
# Only used in test.
#

export XMTPB_POSTGRES_USER=${_XMTPB_POSTGRES_USER}

#
# XMTPB_POSTGRES_PASSWORD is the postgres password to use for the postgres
# database. Only used in test.
#

export XMTPB_POSTGRES_PASSWORD=${_XMTPB_POSTGRES_PASSWORD}