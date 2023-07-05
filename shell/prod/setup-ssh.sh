#!/bin/sh

if [ -z "$XMTPB_DROPLET_PK" ]; then
  echo "DROPLET_PK is not set"
  exit 1
fi

if [ -z "$XMTPB_DROPLET_IP" ]; then
  echo "DROPLET_IP is not set"
  exit 1
fi

if [ -z "$XMTPB_SSH_HOST" ]; then
  echo "SSH_HOST is not set"
  exit 1
fi

if [ -z "$CI" ]; then
  echo "This script is only meant to be run in CI, it could clobber your SSH config!"
  exit 1
fi

mkdir -p ~/.ssh
echo "${XMTPB_DROPLET_PK}" > ~/.ssh/${XMTPB_SSH_HOST}
chmod 400 ~/.ssh/${XMTPB_SSH_HOST}
cat >>~/.ssh/config <<END
Host ${XMTPB_SSH_HOST}
  HostName ${XMTPB_DROPLET_IP}
  User root
  IdentityFile ~/.ssh/${XMTPB_SSH_HOST}
  StrictHostKeyChecking no
END