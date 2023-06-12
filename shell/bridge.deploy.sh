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

bridge_replica_count=$(DOCKER_HOST=ssh://xmtp-bridge-prod docker compose -f ./docker/docker-compose.prod.yml ps | grep bridge | wc -l)

if [ "$BOOT_MODE" = "network" ]; then
  echo "Booting from config file"
  echo "${BOOT_CONFIG_B64}" | base64 --decode > ./shell/boot.json

  scp ./shell/boot.json xmtp-bridge-prod:/root/app

  boot_config=$(cat ./shell/boot.json | jq -c '.')
  boot_config_length=$(echo $boot_config | jq '. | length')
  scale_number=$((bridge_replica_count+boot_config_length))
else
  echo "Booting from env var"
  scale_number=$((bridge_replica_count+1))
fi


cd nodejs

echo "Deploying bridge to $scale_number replicas"
npm run prod:up -- bridge=$scale_number
