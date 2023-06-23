#!/bin/sh

mkdir -p ~/.ssh
echo "${DROPLET_PK}" > ~/.ssh/target-droplet
chmod 400 ~/.ssh/target-droplet
cat >>~/.ssh/config <<END
Host target-droplet
  HostName ${DROPLET_IP}
  User root
  IdentityFile ~/.ssh/target-droplet
  StrictHostKeyChecking no
END


if [ ! -z $BOOT_CONFIG_B64 ]; then
  export _BOOT_MODE="network"
  . ../shell/env.sh
  echo "Booting from config file"
  echo "${BOOT_CONFIG_B64}" | base64 --decode > ../shell/boot.json

  scp ../shell/boot.json target-droplet:/root/app

  boot_config=$(cat ../shell/boot.json | jq -c '.')
  scale_number=$(echo $boot_config | jq '. | length')

  echo "Deploying bridge to $scale_number replicas"
  DOCKER_HOST=ssh://target-droplet docker compose -f ../docker/docker-compose.yml down
  DOCKER_HOST=ssh://target-droplet docker compose -f ../docker/docker-compose.prod.yml up -d --build --scale bridge=$scale_number
elif [ ! -z $_KEY_TO_BOOT ]; then
  echo "Booting from env var"
  export _BOOT_MODE="env"
  . ../shell/env.sh
  bridge_replica_count=$(DOCKER_HOST=ssh://target-droplet docker compose -f ../docker/docker-compose.prod.yml ps | grep bridge | wc -l)
  scale_number=$((bridge_replica_count+1))

  echo "Deploying bridge to $scale_number replicas"
  DOCKER_HOST=ssh://target-droplet docker compose -f ../docker/docker-compose.prod.yml up -d --build --no-recreate --scale bridge=$scale_number
else
  echo "No boot config found"
  exit 1
fi
