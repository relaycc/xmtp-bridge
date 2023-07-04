export {};

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
