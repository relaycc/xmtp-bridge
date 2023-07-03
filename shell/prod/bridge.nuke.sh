#!/bin/sh

../shell/prod/setup-ssh.sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_BRIDGE_ADDRESS" ]; then
  echo "XMTPB_BRIDGE_ADDRESS is not set"
  exit 1
fi

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker stop "bridge-$XMTPB_BRIDGE_ADDRESS"
DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker rm "bridge-$XMTPB_BRIDGE_ADDRESS"