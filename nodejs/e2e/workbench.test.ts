import * as fs from "fs/promises";
import { Wallet } from "@ethersproject/wallet";
import { cache } from "../src/env.js";

const env = cache();

describe("Workbench:*", async () => {
  it("Generates boot config", async () => {
    const wallets = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    console.log("Writing boot config to " + env.bootOptions.configFilePath);
    console.log(
      "Addresses are",
      wallets.map((wallet) => wallet.address)
    );

    await fs.writeFile(
      env.bootOptions.configFilePath,
      JSON.stringify(
        wallets.map((wallet) => wallet.privateKey),
        null,
        2
      )
    );
  });
});
