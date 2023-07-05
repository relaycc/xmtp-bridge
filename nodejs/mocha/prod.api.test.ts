/* eslint-disable no-console */
import { z } from "zod";
import fetch from "node-fetch";
import * as Env from "../src/env.js";

const API_BASE_URL = `https://api.bridge.relay.network`;
const PROD_CANARY_URL = `https://api.bridge.relay.network/canary`;

const XMTPB_SIGNUP_KEY = Env.read({
  key: "XMTPB_SIGNUP_KEY",
  schema: z.string(),
});

describe("prod:api:test", () => {
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
    const response = await fetch(PROD_CANARY_URL, {
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
        key: XMTPB_SIGNUP_KEY,
        forwardHandler: {
          httpUrl: "https://api.bridge.relay.network/canary",
          isBot: true,
        },
      }),
    });

    if (response.status !== 200) {
      console.log(response.status);
      console.log(response);
      throw new Error(`Signup returned ${response.status}`);
    } else {
      const json = await response.json();
      console.log("Signup successful");
      console.log(JSON.stringify(json, null, 2));
    }

    return true;
  });
});
