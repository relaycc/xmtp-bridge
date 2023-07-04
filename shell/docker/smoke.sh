#!/bin/sh

docker compose -f ../docker/docker-compose.test.yml up -d --build postgres

docker compose -f ../docker/docker-compose.test.yml up -d --build prisma

docker compose -f ../docker/docker-compose.test.yml up -d --build

npx mocha -g 'Smoke tests'