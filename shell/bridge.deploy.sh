#!/bin/sh

. ./shell/env.sh

mkdir -p ~/.ssh
echo "${XMTP_BRIDGE_DROPLET_PK}" > ~/.ssh/xmtp-bridge-prod
chmod 400 ~/.ssh/xmtp-bridge-prod
cat >>~/.ssh/config <<END
Host xmtp-bridge-prod
  HostName ${XMTP_BRIDGE_DROPLET_IP}
  User root
  IdentityFile ~/.ssh/xmtp-bridge-prod
  StrictHostKeyChecking no
END

if [ "${BOOT_MODE}" == "network" ]; then
  echo "Booting from config file"
  echo "${BOOT_CONFIG_B64}" | base64 --decode > ./shell/boot.json
fi

cat ~/.ssh/config

echo "Deploying bridge"
DOCKER_HOST=ssh://xmtp-bridge-prod docker compose -f ./docker/docker-compose.yml up -d
