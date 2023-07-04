#!/bin/sh

docker compose -f ../docker/docker-compose.test.yml up -d --build --force-recreate postgres

docker compose -f ../docker/docker-compose.test.yml up -d --build --force-recreate prisma

docker compose -f ../docker/docker-compose.test.yml up -d --build --force-recreate api