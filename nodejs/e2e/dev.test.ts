import fetch from "node-fetch";

describe("Spin up a dev environment", () => {
  it("Should run the TypeScript compiler", async () => {
    throw new Error("Test failed, did you run npm run dev:tsc?");
  });

  it("Should run the bridge", async () => {
    throw new Error("Bridge isn't running, did you run npm run dev:bridge?");
  });

  it("Should run the cache", async () => {
    throw new Error("Cache isn't running, did you run npm run dev:cache?");
  });

  it("Should run the HTTP target", async () => {
    throw new Error(
      "HTTP target isn't running, did you run npm run dev:target?"
    );
  });
});

/*
 * TODO - The values in this test need to be parameterized in some way!
 */
describe("Smoke tests", () => {
  it("Hooks works", async () => {
    try {
      const response = await fetch("http://localhost:3001/hook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello from the webhook!",
          fromAddress: "0x4779309458EE31Bf9f06181ACE85d76dbA25F1Cd",
          targetAddress: "0xf89773CF7cf0B560BC5003a6963b98152D84A15a",
          token: "0.58574962157360420.98133344551815820.5149317891803253",
        }),
      });
      if (response.status !== 200) {
        throw new Error("Bad status code " + response.status);
      } else {
        // console.log(await response.json());
      }
    } catch (e) {
      throw e;
    }
  });

  it("Signup works", async () => {
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: process.env.SIGNUP_KEY,
          httpUrl: "http://locallhost:3000",
        }),
      });
      if (response.status !== 200) {
        throw new Error("Bad status code " + response.status);
      } else {
        // console.log(await response.json());
      }
    } catch (e) {
      throw e;
    }
  });
});
