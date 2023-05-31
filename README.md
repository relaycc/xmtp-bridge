# Overview

A multi-client XMTP adapter for HTTP APIs.

Deploy a docker-compose cluster of XMTP clients on a single host. Each XMTP
client listens for messages and calls a message handler. The message handler
calls an HTTP API and then sends a response message via XMTP.
