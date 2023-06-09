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
