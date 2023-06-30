/* eslint-disable no-console */
import { z } from "zod";

export type Parser<Z extends z.ZodTypeAny> = {
  message: string;
  schema: Z;
};

export const parse = <Z extends z.ZodTypeAny>({
  message,
  schema,
  val,
}: {
  val: unknown;
  message: string;
  schema: Z;
}): z.infer<Z> => {
  try {
    return schema.parse(val);
  } catch (error) {
    console.log("--------------BEGIN PARSE FAILED---------------------");
    console.log(message);
    console.log("--------------END PARSE FAILED---------------------");
    throw error;
  }
};

export const zJsonString = z.string().transform((val, ctx) => {
  try {
    return JSON.parse(val);
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid JSON string",
    });

    return z.NEVER;
  }
});

export const getRandom = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
