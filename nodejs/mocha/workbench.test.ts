/* eslint-disable no-console */
import fetch from "node-fetch";

describe("Workbench:*", async () => {
  it("Sign someone up", async () => {
    const API_ENDPOINT = "http://localhost:3000";
    const SIGNUP_KEY = "0xFAIL";
    const TARGET_URL = "http://some-fun-server.com";
    try {
      const response = await fetch(`${API_ENDPOINT}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: SIGNUP_KEY,
          httpUrl: TARGET_URL,
        }),
      });
      if (response.status !== 200) {
        throw new Error("Bad status code " + response.status);
      } else {
        console.log(await response.json());
      }
    } catch (e) {
      throw e;
    }
  });
});
