/* eslint-disable no-console */
import { z } from "zod";
import fetch from "node-fetch";
import { Wallet } from "@ethersproject/wallet";
import { Client } from "@xmtp/xmtp-js";
import { v4 as uuid } from "uuid";
import { writeFile, readFile } from "fs/promises";
import * as Env from "../src/env.js";

// TODO - I'm not a big fan of importing from src here, we want the application
// to be mostly a black box, but it _might_ be ok to treat config as an exception.
const env = Env.api();

// TODO - We should NOT be reading directly from process.env.
const API_BASE_URL = `http://localhost:${process.env.XMTPB_API_PORT}`;

describe("Use the API", () => {
  it("GET /", async () => {
    let timeout = false;

    setTimeout(() => {
      timeout = true;
    }, 10000);

    while (!timeout) {
      try {
        const response = await fetch(API_BASE_URL);
        const json = (await response.json()) as { ok: boolean };
        if (json.ok !== true) {
          throw new Error(
            "API isn't running, did you do npm run docker:test:up?"
          );
        } else {
          return true;
        }
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error("API isn't running, all tests failed!");
  });

  it("POST /canary", async () => {
    const CANARY_MESSAGE = "This is from the smoke test suite!";
    const response = await fetch(`${API_BASE_URL}/canary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          content: CANARY_MESSAGE,
        },
      }),
    });

    const json = (await response.json()) as { ok: boolean; data: string };
    if (json.ok !== true) {
      throw new Error("Canary didn't return ok === true");
    }
    if (
      json.data !==
      `Hello from the proxied server! Your message was: ${CANARY_MESSAGE}`
    ) {
      throw new Error("Canary didn't return the expected message");
    }
    return true;
  });

  it("POST /signup", async () => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: env.signupKey,
        httpUrl: `http://api:3000/canary`,
      }),
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(await response.json());
      throw new Error(`Signup returned ${response.status}`);
    }

    const zResponse = z.object({
      ethAddress: z.string(),
      hookToken: z.string().uuid(),
    });

    const json = await response.json();

    const validatedJson = zResponse.parse(json);

    await writeSignupData({
      address: validatedJson.ethAddress,
      token: validatedJson.hookToken,
    });

    return true;
  });
});

describe("Use the bridge", () => {
  it("POST /hook", async function () {
    this.timeout(10000);

    const signupData = await readSignupData();

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
        sendFromBridgeAddress: signupData.address,
        targetAddress: recipient.address,
        message,
        token: signupData.token,
      }),
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(await response.json());
      throw new Error(`/hook API returned ${response.status}`);
    }

    const json = await response.json();

    /* eslint-disable-next-line no-console */
    console.log(JSON.stringify(json, null, 2));

    /*
     * Give XMTP some time to process the message
     */

    await new Promise((resolve) => setTimeout(resolve, 4000));

    /*
     * Find the message in the recipient's inbox
     */

    const messageFromHook = await (async () => {
      const conversation = await recipient.conversations.newConversation(
        signupData.address
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

  it("Forwards messages from XMTP to the HTTP endpoint", async function () {
    const signupData = await readSignupData();

    /* Testing this will require we read some data that was sent to the HTTP
     * endpoint that a bridge forwards messages to. We could do that with our
     * canary endpoint, but then we need to have some authentication in front of
     * the canary endpoint. For now, just send a message to the bridge address using
     * xmtp.chat. */
    console.log(
      `Use XMTP.chat to send a message to ${signupData.address} and see if you get a response.`
    );

    return true;
  });
});

/*
 *
 * TODO DOCUMENT THE **** OUT OF THIS IMPLICIT COUPLING
 *
 */

const SIGNUP_FILE = "/tmp/0x0RANDOMPREFIX-signup.json";

const writeSignupData = async ({
  address,
  token,
}: {
  address: string;
  token: string;
}) => {
  return writeFile(SIGNUP_FILE, JSON.stringify({ address, token }));
};

const readSignupData = async () => {
  const data = await readFile(SIGNUP_FILE);
  return z
    .object({
      address: z.string(),
      token: z.string(),
    })
    .parse(JSON.parse(data.toString()));
};
