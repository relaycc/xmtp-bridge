import fetch from "node-fetch";

describe("Smoke tests", () => {
  describe("for the API", () => {
    it("GET /", async () => {
      let timeout = false;

      setTimeout(() => {
        timeout = true;
      }, 10000);

      while (!timeout) {
        try {
          await fetch(`http://localhost:${process.env.XMTPB_API_PORT}`);
          return true;
        } catch (e) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      throw new Error("API isn't running, all tests failed!");
    });

    it("POST /canary", async () => {
      return true;
    });

    it("POST /hook", async () => {
      return true;
    });

    it("POST /signup", async () => {
      return true;
    });
  });

  describe("for the bridge", () => {
    it("XMTP bridge forward proxy", async () => {
      return true;
    });

    it("XMTP bridge reverse proxy", async () => {
      return true;
    });
  });
});
