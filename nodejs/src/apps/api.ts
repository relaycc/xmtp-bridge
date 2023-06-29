import express from "express";
import { readFileSync } from "fs";
import { cache } from "../env.js";
import { Wallet } from "@ethersproject/wallet";
import { z } from "zod";
import { parse } from "../lib.js";

const env = cache();

const zBootKeys = z.string().transform((val) => {
  const json = JSON.parse(val);
  const keys = z.array(z.string()).parse(json);
  const wallets = keys.map((key) => new Wallet(key));
  return wallets.map((wallet) => wallet.privateKey);
});

const keysToBoot = parse({
  message: "Boot config file must be a JSON array of private keys",
  schema: zBootKeys,
  val: readFileSync(env.bootOptions.configFilePath).toString(),
});

const KEYS_CACHE = {
  keysToBoot,
};

const app = express();

app.use(express.json());

app.post("/", (_req, res) => {
  res.send({
    ok: true,
    keyToBoot: KEYS_CACHE.keysToBoot.pop(),
  });
});

app.listen(env.bootOptions.port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Boot service listening on port ${env.bootOptions.port}`);
});
