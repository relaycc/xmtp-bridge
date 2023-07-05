#!/bin/sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_IMAGE_TAG" ]; then
  echo "XMTPB_IMAGE_TAG is not set"
  exit 1
fi

../shell/prod/setup-ssh.sh

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker compose -f ../docker/docker-compose.api.yml down
