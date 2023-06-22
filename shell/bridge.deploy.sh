#!/bin/sh

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


if [ ! -z $BOOT_CONFIG_B64 ]; then
  export _BOOT_MODE="network"
  . ./shell/env.sh
  echo "Booting from config file"
  echo "${BOOT_CONFIG_B64}" | base64 --decode > ./shell/boot.json

  scp ./shell/boot.json xmtp-bridge-prod:/root/app

  boot_config=$(cat ./shell/boot.json | jq -c '.')
  scale_number=$(echo $boot_config | jq '. | length')

  cd nodejs
  echo "Deploying bridge to $scale_number replicas"
  npm run prod:reset -- bridge=$scale_number
elif [ ! -z $_KEY_TO_BOOT ]; then
  echo "Booting from env var"
  export _BOOT_MODE="env"
  . ./shell/env.sh
  bridge_replica_count=$(DOCKER_HOST=ssh://xmtp-bridge-prod docker compose -f ./docker/docker-compose.prod.yml ps | grep bridge | wc -l)
  scale_number=$((bridge_replica_count+1))

  cd nodejs
  echo "Deploying bridge to $scale_number replicas"
  npm run prod:add -- bridge=$scale_number
else
  echo "No boot config found"
  exit 1
fi
