# Overview

A multi-client XMTP adapter for HTTP APIs.

Deploy a docker-compose cluster of XMTP clients on a single host. Each XMTP
client listens for messages and calls a message handler. The message handler
calls an HTTP API and then sends a response message via XMTP.

# QUICKSTART
create a file `shell/boot.json` with the following contents
```bash
[
  "0xcb6dfc687a5a568d35ba6754febe8f551a8766cdfbade993501dba51d3e8c2ea",
  "0x3f4c58fa5efd04868c33b8ca68c6264ca1f0147416582918b455582fe5fc8de2"
]
```

run this command
```bash
cd nodejs && . ../shell/example_env.sh && npm run dev:up
```

You can get the public address to message by getting logs from the bridge container
`docker logs docker-bridge-1`

# How It Works

- app.ts is the executable file for each bridge instance
- bridge.ts is the factory for creating an XMTP client that we can attach
  listeners to
- cache.ts is a simple express server that can be used to serve state. Right now
  it is only being used to serve private keys to app instances that are booting
  up..
- env.ts reads and parses env vars
- lib.ts cotains a utility for adding error messages to zod parsing. This might
  be a bad idea.
- protocol.ts contains the request-response types and handler used to forward
  messages from XMTP to HTTP.

# Run It

You can either start the system in network boot mode or in env boot mode.
Network boot mode requires a config file with private keys in it. The app
instances will fetch these keys from the cache service.

At this point you should read `shell/env.sh` to see what env vars you need to
set.

If you are using network boot mode you will need to start the cache server
first: `npm run dev:cache`. Then you can start the bridge instances: `npm run
dev:bridge`. If the config file with private keys has more than one key, you
should be able to run `npm run dev:bridge` once for each key.

Before the bridge will work, you'll need to start the HTTP server that they're
forwarding to: `npm run dev:target`.

At this point, you should be able to send an XMTP message to any address
corresponding to one of the bridges and then receive a response.

# Manage It

You can spin up a local environment with `npm run dev:up`. This will start the
cache, bridge, and target services.

