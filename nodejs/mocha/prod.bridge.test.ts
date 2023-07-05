/* eslint-disable no-console */
import { z } from "zod";
import fetch from "node-fetch";
import * as Env from "../src/env.js";
import { Wallet } from "@ethersproject/wallet";
import { Client } from "@xmtp/xmtp-js";
import { v4 as uuid } from "uuid";

const TWO_MINUTES_MS = 1000 * 60 * 2;

const SIGNUP_KEY = Env.read({
  key: "XMTPB_SIGNUP_KEY",
  schema: z.string(),
});

const API_BASE_URL = `https://api.bridge.relay.network`;

const BRIDGE_ADDRESS = Env.read({
  key: "XMTPB_BRIDGE_ADDRESS",
  schema: z.string(),
});

describe("A bridge is working", () => {
  it("The bridge is up and running", async () => {
    const response = await fetch(`${API_BASE_URL}/instance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: SIGNUP_KEY,
        bridgeAddress: BRIDGE_ADDRESS,
      }),
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(await response.json());
      throw new Error(`Fetching the instance returned ${response.status}`);
    }

    const json = await response.json();

    const validatedJson = z
      .object({
        heartbeat: z.string(),
      })
      .parse(json);

    const heartbeat = new Date(validatedJson.heartbeat);

    if (heartbeat.getTime() < Date.now() - TWO_MINUTES_MS) {
      throw new Error("Heartbeat is too old, bridge is not up and running!");
    }

    return true;
  });

  it("POST /hook", async function () {
    this.timeout(10000);

    /*
     * Create an XMTP identity to send to using the webhook
     */

    const recipient = await Client.create(Wallet.createRandom(), {
      env: "production",
    });

    /*
     * Use a uuid as the message so we can find it later
     */

    const message = uuid();

    /*
     * Call the webhook to send the message
     */

    const response = await fetch(`${API_BASE_URL}/hook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sendFromBridgeAddress: BRIDGE_ADDRESS,
        targetAddress: recipient.address,
        message,
        token: SIGNUP_KEY,
      }),
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(await response.json());
      throw new Error(`/hook API returned ${response.status}`);
    }

    /*
     * Give XMTP some time to process the message
     */

    await new Promise((resolve) => setTimeout(resolve, 4000));

    /*
     * Find the message in the recipient's inbox
     */

    const messageFromHook = await (async () => {
      const conversation = await recipient.conversations.newConversation(
        BRIDGE_ADDRESS
      );
      const messages = await conversation.messages();

      return messages.find((m) => m.content === message);
    })();

    /*
     * If we found the sent message, the test passes.
     */

    if (messageFromHook === undefined) {
      throw new Error("Message from hook not found");
    } else {
      return true;
    }
  });

  /* TODO - Not sure what the best way to implement this is at the moment. */
  it("Forwards messages from XMTP to the canary");
});
