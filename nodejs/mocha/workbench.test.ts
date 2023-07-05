/* eslint-disable no-console */
import { prisma } from "../src/db.js";

describe("Some production stats", () => {
  it("Shows the number of instances", async () => {
    const instances = await prisma.instance.findMany({
      include: {
        bridge: true,
      },
    });

    console.log("Number of instances: " + instances.length);

    const staleInstances = instances.filter((instance) => {
      const now = new Date();
      const heartbeat = new Date(instance.heartbeat);
      const diff = now.getTime() - heartbeat.getTime();
      return diff > 1000 * 60 * 2;
    });
    console.log("Number of stale instances: " + staleInstances.length);

    for (const instance of staleInstances) {
      console.log(`Stale instance: ${instance.id}`);
    }
  });

  it("Shows the number of bridges", async () => {
    const bridges = await prisma.bridge.findMany({
      include: { instance: true },
    });
    console.log("Number of bridges: " + bridges.length);

    const instances = await prisma.instance.findMany();
    console.log("Number of instances: " + instances.length);

    for (const bridge of bridges) {
      if (bridge.instance === null) {
        console.log(`Bridge without instance: ${bridge.id}`);
      }
    }
  });
});
