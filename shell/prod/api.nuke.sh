#!/bin/sh

../shell/prod/setup-ssh.sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker compose -f ../docker/docker-compose.api.yml down
