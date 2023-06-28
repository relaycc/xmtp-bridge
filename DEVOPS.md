# Deployment
There are multiple cases we need to cover for deployments:
1. Deploy a set of XMTP-Bridge instances to a brand new server
2. Update all running XMTP-Bridge instances
3. Add a new instance of XMTP-Bridge
All of these cases are covered by the github actions in the `.github/workflows` directory.

## Deploy a set of XMTP-Bridge instances to a brand new server
In this situation, we need to deploy all known instance of XMTP-Bridge. In order to do this we need all known private keys for the instances. Once you have the private keys, you can run the workflow in the github actions UI. Select `Run Wrokflow`. The "Boot Mode" should be `network` and we need to provide a "Boot Config File". This file should be an array of private keys. Here is an example of what the file should look like:
```json
[
  "0xcb6dfc687a5a568d35ba6754febe8f551a8766cdfbade993501dba51d3e8c2ea",
  "0x3f4c58fa5efd04868c33b8ca68c6264ca1f0147416582918b455582fe5fc8de2"
]
```
provide a base64 encoded version of this file to the "Boot Config File" input in github actions. You can do this in the terminal with the following command:
```bash
cat boot-config.json | base64
```
Select "Run Workflow" and the instances will be deployed.

## Update all running XMTP-Bridge instances
This process is the same as deploying to a brand new server.

## Add a new instance of XMTP-Bridge
Adding a new instance of XMTP-Bridge is pretty simple. You need to get a private key and then head over to github actions. Select `Run Wrokflow`. The "Boot Mode" should be `env` and we need to provide a private key to the "Key to Boot" option. Select "Run Workflow" and the new instance will be deployed.
