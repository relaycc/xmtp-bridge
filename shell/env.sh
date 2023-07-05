#!/bin/sh

#
# SENTRY_DSN is used by the Sentry platform to track errors.
#
#

if [ -z "${_XMTPB_SENTRY_DSN}" ]; then
  echo "WARNING :: XMTPB_SENTRY_DSN is not set"
fi

export XMTPB_SENTRY_DSN=${_XMTPB_SENTRY_DSN}


#
# API_URL is the URL of the cache service.
#
#

if [ -z "${_XMTPB_API_URL}" ]; then
  echo "WARNING :: XMTPB_API_URL is not set"
fi

export XMTPB_API_URL=${_XMTPB_API_URL}

#
# API_PORT is the port of the cache service.
#
#

if [ -z "${_XMTPB_API_PORT}" ]; then
  echo "WARNING :: XMTPB_API_PORT is not set"
fi

export XMTPB_API_PORT=${_XMTPB_API_PORT}

#
# WEBHOOK_KEY is the address that the webhook server will use to send
# messages to bridge instances.
#

if [ -z "${_XMTPB_WEBHOOK_KEY}" ]; then
  echo "WARNING :: XMTPB_WEBHOOK_KEY is not set"
fi

export XMTPB_WEBHOOK_KEY=${_XMTPB_WEBHOOK_KEY}

#
# The connection string for the project's postgres database.
#
#

if [ -z "${_XMTPB_PG_CONNECTION_STRING}" ]; then
  echo "WARNING :: XMTPB_PG_CONNECTION_STRING is not set"
fi

export XMTPB_PG_CONNECTION_STRING=${_XMTPB_PG_CONNECTION_STRING}

#
# The key we use to authenticate the /signup endpoint
#
#

if [ -z "${_XMTPB_SIGNUP_KEY}" ]; then
  echo "WARNING :: XMTPB_SIGNUP_KEY is not set"
fi

export XMTPB_SIGNUP_KEY=${_XMTPB_SIGNUP_KEY}

#
# The address of the XMTP identity we want to bridge.
#
#

if [ -z "${_XMTPB_BRIDGE_ADDRESS}" ]; then
  echo "WARNING :: XMTPB_BRIDGE_ADDRESS is not set"
fi

export XMTPB_BRIDGE_ADDRESS=${_XMTPB_BRIDGE_ADDRESS}

#
# VIRTUAL_HOST is the domain name that the bridge will be hosted on.
#
#

if [ -z "${_XMTPB_VIRTUAL_HOST}" ]; then
  echo "WARNING :: XMTPB_VIRTUAL_HOST is not set"
fi

export XMTPB_VIRTUAL_HOST=${_XMTPB_VIRTUAL_HOST}


#
# LETSENCRYPT_HOST is the domain name that the bridge will be hosted on.
#
#

if [ -z "${_XMTPB_LETSENCRYPT_HOST}" ]; then
  echo "WARNING :: XMTPB_LETSENCRYPT_HOST is not set"
fi

export XMTPB_LETSENCRYPT_HOST=${_XMTPB_LETSENCRYPT_HOST}

#
# XMTPB_VIRTUAL_PORT is the port that the API server will listen to
#
#

if [ -z "${_XMTPB_VIRTUAL_PORT}" ]; then
  echo "WARNING :: XMTPB_VIRTUAL_PORT is not set"
fi

export XMTPB_VIRTUAL_PORT=${_XMTPB_VIRTUAL_PORT}

#
# SSH_HOST is the SSH alias we use to connect to the prod server.
#
#

if [ -z "${_XMTPB_SSH_HOST}" ]; then
  echo "WARNING :: XMTPB_SSH_HOST is not set"
fi

export XMTPB_SSH_HOST=${_XMTPB_SSH_HOST}

#
# XMTPB_DEFAULT_EMAIL is the email LetsEncrypt will use to contact us about our
# SSL certificates.
#

if [ -z "${_XMTPB_DEFAULT_EMAIL}" ]; then
  echo "WARNING :: XMTPB_DEFAULT_EMAIL is not set"
fi

export XMTPB_DEFAULT_EMAIL=${_XMTPB_DEFAULT_EMAIL}

#
# XMTPB_IMAGE_TAG is the docker image tag to use for everything.
#
#

if [ -z "${_XMTPB_IMAGE_TAG}" ]; then
  echo "WARNING :: XMTPB_IMAGE_TAG is not set"
fi

export XMTPB_IMAGE_TAG=${_XMTPB_IMAGE_TAG}

#
# XMTPB_POSTGRES_USER is the postgres user to use for the postgres database.
# Only used in test.
#

if [ -z "${_XMTPB_POSTGRES_USER}" ]; then
  echo "WARNING :: XMTPB_POSTGRES_USER is not set"
fi

export XMTPB_POSTGRES_USER=${_XMTPB_POSTGRES_USER}

#
# XMTPB_POSTGRES_PASSWORD is the postgres password to use for the postgres
# database. Only used in test.
#

if [ -z "${_XMTPB_POSTGRES_PASSWORD}" ]; then
  echo "WARNING :: XMTPB_POSTGRES_PASSWORD is not set"
fi

export XMTPB_POSTGRES_PASSWORD=${_XMTPB_POSTGRES_PASSWORD}

#
# XMTPB_WORKBENCH_ID is the ID of the workbench we want to use for testing.
#
#

if [ -z "${_XMTPB_WORKBENCH_ID}" ]; then
  echo "WARNING :: XMTPB_WORKBENCH_ID is not set"
fi

export XMTPB_WORKBENCH_ID=${_XMTPB_WORKBENCH_ID}

#
# XMTPB_DROPLET_PK is the SSH key used to connect to the prod droplet
#
#

if [ -z "${_XMTPB_DROPLET_PK}" ]; then
  echo "WARNING :: XMTPB_DROPLET_PK is not set"
fi

export XMTPB_DROPLET_PK=${_XMTPB_DROPLET_PK}

#
# XMTPB_DROPLET_IP is the IP address of the prod droplet
#
#

if [ -z "${_XMTPB_DROPLET_IP}" ]; then
  echo "WARNING :: XMTPB_DROPLET_IP is not set"
fi

export XMTPB_DROPLET_IP=${_XMTPB_DROPLET_IP}