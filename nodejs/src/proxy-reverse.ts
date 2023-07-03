import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { parse, zJsonString } from "./lib.js";
import { Bridge } from "./bridge.js";

const zSourceRequest = z.object({
  conversation: z.object({
    peerAddress: z.string(),
    context: z
      .object({
        conversationId: z.string(),
      })
      .optional(),
  }),
  content: zJsonString.pipe(
    z.object({
      targetAddress: z.string(),
      message: z.string(),
    })
  ),
});

export const handler =
  ({ whitelist }: { whitelist: string[] }) =>
  async ({
    message,
    bridge,
  }: {
    bridge: Bridge;
    message: DecodedMessage;
  }): Promise<void> => {
    if (!whitelist.includes(message.senderAddress)) {
      return;
    }

    const validatedMessage = parse({
      message: "Source request validation failed",
      val: message,
      schema: zSourceRequest,
    });

    const request = validatedMessage.content;

    await bridge.send({
      toAddress: request.targetAddress,
      msg: validatedMessage.content.message,
    });
  };
