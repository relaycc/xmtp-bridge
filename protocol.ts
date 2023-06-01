import { z } from "zod";
import { DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "@ethersproject/wallet";

const config = (() => {
  return {
    wallet: new Wallet(z.string().parse(process.env.XMTP_PK)),
    targetOptions: {
      url: z.string().parse(process.env.TARGET_URL),
      method: z.string().parse(process.env.TARGET_METHOD),
    },
  };
})();

export const zHandleableMessage = z.object({
  senderAddress: z.string().superRefine((val, ctx) => {
    if (val === config.wallet.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender address cannot be the same as the bridge address",
      });
    } else {
      return val;
    }
  }),
});

export const zValidMessage = z.object({
  content: z.string(),
});

export const zTargetRequest = z.object({
  url: z.string(),
  method: z.literal("POST"),
  headers: z.object({
    "Content-Type": z.literal("application/json"),
  }),
  body: z.object({
    bridgePeerAddress: z.string(),
    message: z.object({
      conversation: z.object({
        peerAddress: z.string(),
        context: z
          .object({
            conversationId: z.string(),
          })
          .optional(),
      }),
      content: z.string(),
    }),
  }),
});

export type TargetRequest = z.infer<typeof zTargetRequest>;

export type MapMessageToTargetRequest = ({
  message,
}: {
  message: DecodedMessage;
}) => TargetRequest;

export type CallHttpApi = ({
  request,
}: {
  request: TargetRequest;
}) => Promise<TargetResponse>;

export const zTargetResponse = z.object({
  ok: z.boolean(),
  payload: z.string(),
});

export type TargetResponse = z.infer<typeof zTargetResponse>;

export type MapResponseToContent = ({
  response,
}: {
  response: TargetResponse;
}) => string;
