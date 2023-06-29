import { z } from "zod";
import * as fs from "fs/promises";
import { Wallet } from "@ethersproject/wallet";
import { api } from "../src/env.js";
import { prisma } from "../src/db.js";

const env = api();

describe("Workbench:*", async () => {
  it("Generates boot config", async () => {
    const wallets = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    await fs.writeFile(
      env.bootOptions.configFilePath,
      JSON.stringify(
        wallets.map((wallet) => wallet.privateKey),
        null,
        2
      )
    );
  });

  it("Adds bridge records corresponding to the boot config", async () => {
    const bootConfig = z
      .array(z.string())
      .parse(
        JSON.parse(await fs.readFile(env.bootOptions.configFilePath, "utf-8"))
      );

    for (const privateKey of bootConfig) {
      const wallet = new Wallet(privateKey);

      await prisma.bridge.create({
        data: {
          ethAddress: wallet.address,
          hookToken: `${Math.random()}${Math.random()}${Math.random()}`,
        },
      });
    }
  });
});
