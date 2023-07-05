#!/bin/sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_API_PORT" ]; then
  echo "XMTPB_API_PORT is not set"
  exit 1
fi

if [ -z "$XMTPB_API_URL" ]; then
  echo "XMTPB_API_URL is not set"
  exit 1
fi

if [ -z "$XMTPB_PG_CONNECTION_STRING" ]; then
  echo "XMTPB_PG_CONNECTION_STRING is not set"
  exit 1
fi

if [ -z "$XMTPB_SIGNUP_KEY" ]; then
  echo "XMTPB_SIGNUP_KEY is not set"
  exit 1
fi

if [ -z "$XMTPB_IMAGE_TAG" ]; then
  echo "XMTPB_IMAGE_TAG is not set"
  exit 1
fi

if [ -z "$XMTPB_WEBHOOK_KEY" ]; then
  echo "XMTPB_WEBHOOK_KEY is not set"
  exit 1
fi

if [ -z "$XMTPB_VIRTUAL_HOST" ]; then
  echo "XMTPB_VIRTUAL_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_LETSENCRYPT_HOST" ]; then
  echo "XMTPB_LETSENCRYPT_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_VIRTUAL_PORT" ]; then
  echo "XMTPB_VIRTUAL_PORT is not set"
  exit 1
fi

if [ -z "$XMTPB_DEFAULT_EMAIL" ]; then
  echo "XMTPB_DEFAULT_EMAIL is not set"
  exit 1
fi

../shell/prod/setup-ssh.sh

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker compose -f ../docker/docker-compose.api.yml up -d --build --force-recreate
