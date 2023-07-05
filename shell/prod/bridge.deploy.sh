#!/bin/sh

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "XMTPB_SSH_HOST is not set"
  exit 1
fi

if [ -z "$XMTPB_IMAGE_TAG" ]; then
  echo "XMTPB_IMAGE_TAG is not set"
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
  -t "bridge:${XMTPB_IMAGE_TAG}" \
  .

DOCKER_HOST=ssh://${XMTPB_SSH_HOST} docker run \
  -e "XMTPB_PG_CONNECTION_STRING=$XMTPB_PG_CONNECTION_STRING" \
  -e "XMTPB_BRIDGE_ADDRESS=$XMTPB_BRIDGE_ADDRESS" \
  -e "XMTPB_WEBHOOK_KEY=$XMTPB_WEBHOOK_KEY" \
  --name "bridge-$XMTPB_BRIDGE_ADDRESS" \
  --detach \
  bridge:${XMTPB_IMAGE_TAG} \
  "build/src/apps/bridge.js"

