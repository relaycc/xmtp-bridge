#!/bin/sh

../shell/prod/setup-ssh.sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_GITHUB_SHA" ]; then
  echo "XMTPB_GITHUB_SHA is not set"
  exit 1
fi

if [ -z "$XMTPB_PG_CONNECTION_STRING" ]; then
  echo "XMTPB_PG_CONNECTION_STRING is not set"
  exit 1
fi

if [ -z "$XMTPB_BRIDGE_ADDRESS" ]; then
  echo "XMTPB_BRIDGE_ADDRESS is not set"
  exit 1
fi

if [ -z "$XMTPB_WEBHOOK_KEY" ]; then
  echo "XMTPB_WEBHOOK_KEY is not set"
  exit 1
fi

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker build \
  -f ../docker/Dockerfile \
  -t "bridge:${XMTPB_GITHUB_SHA}" \
  .

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker run \
  -e "PG_CONNECTION_STRING=$XMTPB_PG_CONNECTION_STRING" \
  -e "BRIDGE_ADDRESS=$XMTPB_BRIDGE_ADDRESS" \
  -e "WEBHOOK_KEY=$XMTPB_WEBHOOK_KEY" \
  --name "bridge-$XMTPB_BRIDGE_ADDRESS" \
  bridge:${XMTPB_GITHUB_SHA} \
  "build/src/apps/bridge.js"

