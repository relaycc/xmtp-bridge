import { Bridge } from "@prisma/client";
import { prisma } from "./db.js";
import * as Lib from "./lib.js";

const HEARTBEAT_TIMEOUT_MS = 1000 * 60 * 2;
const MAX_BOOT_LOCK_ATTEMPTS = 10;

export const pickBridgeToBoot = async (): Promise<Bridge | null> => {
  let timeout = false;
  setTimeout(() => {
    timeout = true;
  }, HEARTBEAT_TIMEOUT_MS + 5000);

  let bridgeToBoot: Bridge | null = await _pickBridgeToBoot();

  while (!timeout && bridgeToBoot === null) {
    console.log("Did not find a bridge to boot, sleeping for 5 seconds.");
    await Lib.sleep(5000);
    bridgeToBoot = await _pickBridgeToBoot();
  }

  return bridgeToBoot;
};

export const _pickBridgeToBoot = async (): Promise<Bridge | null> => {
  /* Any bridge that does not have an instance is bootable.
   * TODO -- Any bridge that has an instance with a stale heartbeat is bootable. */
  const bootableBridges = await prisma.bridge.findMany({
    where: {
      OR: [
        { instance: null },
        {
          instance: {
            heartbeat: { lt: new Date(Date.now() - HEARTBEAT_TIMEOUT_MS) },
          },
        },
      ],
    },
    include: {
      instance: true,
    },
  });

  console.log(`Found ${bootableBridges.length} bootable bridges.`);

  if (bootableBridges.length === 0) {
    return null;
  }

  let bootLockAttempts = 0;
  let bridgeId: string | null = null;

  while (bootLockAttempts < MAX_BOOT_LOCK_ATTEMPTS) {
    console.log(
      `Attempting to acquire boot lock, attempt ${bootLockAttempts + 1}.`
    );

    try {
      /* Pick a random bridge to reduce the chance of conflict with other
       * booting processes. */
      const bridgeToTry = Lib.getRandom(bootableBridges);

      console.log(
        `Attempting to acquire boot lock for bridge ${bridgeToTry.id}.`
      );

      /* If the bridge has an instance, delete it. This should be ok because the
       * instance isn't posting heartbeats. */
      if (bridgeToTry.instance !== null) {
        await prisma.instance.delete({
          where: {
            id: bridgeToTry.instance.id,
          },
        });
      }

      /* bridgeId is a unique row, so we can use creating a row as "acquiring a lock". */
      await prisma.instance.create({
        data: {
          bridge: {
            connect: {
              id: bridgeToTry.id,
            },
          },
        },
      });
      bridgeId = bridgeToTry.id;
      break;
    } catch (err) {
      console.log(
        `Failed to acquire boot lock on attempt ${bootLockAttempts + 1}.`
      );
      bootLockAttempts++;
    }
  }

  if (typeof bridgeId !== "string") {
    return null;
  } else {
    console.log(`Acquired boot lock for bridge ${bridgeId}.`);

    return prisma.bridge.findUniqueOrThrow({
      where: {
        id: bridgeId,
      },
    });
  }
};
