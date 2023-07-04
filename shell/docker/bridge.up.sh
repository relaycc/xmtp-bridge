#!/bin/sh

SIGNUP_FILE="/tmp/0x0RANDOMPREFIX-signup.json"

if [ ! -f $SIGNUP_FILE ]; then
  echo "No signup file found at $SIGNUP_FILE"
  exit 1
fi

ADDRESS=$(cat $SIGNUP_FILE | jq -r '.address')

if [ ${#ADDRESS} -ne 42 ]; then
  echo "Invalid address length: ${#ADDRESS}"
  exit 1
fi

# ******************************************************************************
# TODO DOCUMENT THE **** OUT OF THIS IMPLICIT COUPLING
# TODO THIS VIOLATES THE RULE THAT ENV VARS ARE ONLY SET IN THE CENTRAL ENV FILE
# TODO THIS MUST BE FIXED THE FIRST TIME IT CAUSES A PROBLEM
# ******************************************************************************
export XMTPB_BRIDGE_ADDRESS="$ADDRESS"

docker compose -f ../docker/docker-compose.test.yml up -d --build bridge