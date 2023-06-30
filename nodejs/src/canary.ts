import { bridge, Handler } from "./bridge.js";
import { prisma } from "./db.js";
import { z } from "zod";
import { v4 as uuid } from "uuid";

export const BRIDGE_HEARTBEAT_TIMEOUT_MS = 1000 * 60 * 2;

/* ****************************************************************************
 *
 * THIS FILE IS WIP
 *
 * ****************************************************************************/

export const scan = async ({ privateKey }: { privateKey: string }) => {
  const xmtp = await bridge({ privateKey });
  const bridges = await prisma.bridge.findMany();
  const scans: Record<string, string> = {};
  const replies: Record<string, string> = {};

  const sendScan = async ({
    bridgePeerAddress,
  }: {
    bridgePeerAddress: string;
  }) => {
    const scanId = uuid();
    scans[scanId] = bridgePeerAddress;
  };

  // await xmtp.send({
  //   to: bridgePeerAddress,
  //   content: scanId,
  // });
};
