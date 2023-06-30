import { z } from "zod";
import * as fs from "fs/promises";
import { Wallet } from "@ethersproject/wallet";
import { prisma } from "../src/db.js";

describe("Workbench:*", async () => {
  it("Generates boot config", async () => {
    const wallets = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    await fs.writeFile(
      process.env.BOOT_CONFIG_FILE_PATH as string,
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
        JSON.parse(
          await fs.readFile(
            process.env.BOOT_CONFIG_FILE_PATH as string,
            "utf-8"
          )
        )
      );

    for (const privateKey of bootConfig) {
      const wallet = new Wallet(privateKey);

      await prisma.bridge.create({
        data: {
          ethAddress: wallet.address,
          hookToken: `${Math.random()}${Math.random()}${Math.random()}`,
          bootKey: wallet.privateKey,
          httpUrl: "http://canary:3000",
        },
      });
    }
  });
});
