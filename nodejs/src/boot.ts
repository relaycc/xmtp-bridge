import { Bridge } from "@prisma/client";
import { prisma } from "./db.js";

export const pickBridgeToBoot = async (): Promise<Bridge | null> => {
  /*
   * Any bridge that does not have an instance is bootable.
   * Any bridge that has an instance with a stale heartbeat is bootable.
   */
  const bootable = await prisma.bridge.findMany({
    where: {
      instance: null,
      OR: [
        {
          instance: {
            heartbeat: {
              lt: new Date(Date.now() - 1000 * 60 * 2),
            },
          },
        },
      ],
    },
  });

  /*
   * Pick a random bridge to boot to minimize conflicts with other booting
   * processes.
   */
  const bootableIndex = Math.floor(Math.random() * bootable.length);

  const MAX_BOOT_LOCK_ATTEMPTS = 10;

  let bootLockAttempts = 0;
  let bridgeId: string | null = null;

  while (bootLockAttempts < MAX_BOOT_LOCK_ATTEMPTS) {
    try {
      const bridgeIdToTry = bootable[bootableIndex].id;
      await prisma.instance.create({
        data: {
          bridge: {
            connect: {
              id: bridgeIdToTry,
            },
          },
        },
      });
      bridgeId = bridgeIdToTry;
      break;
    } catch (err) {
      bootLockAttempts++;
    }
  }

  if (typeof bridgeId !== "string") {
    return null;
  } else {
    return prisma.bridge.findUniqueOrThrow({
      where: {
        id: bridgeId,
      },
    });
  }
};
