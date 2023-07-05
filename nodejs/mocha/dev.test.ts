export {};

/*
 * The purpose of the dev test suite is to give a developer confidence that
 * their dev environment is up and running. Additionally, every failing test
 * should point the developer one step closer to getting their dev environment
 * up and running.
 */

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
