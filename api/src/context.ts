import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Env } from "./index.ts";

export const createContext = async ({
  req,
  env,
  resHeaders,
}: FetchCreateContextFnOptions & {
  env: Env;
}) => {
  const responseHeaders = resHeaders;
  responseHeaders.set("Access-Control-Allow-Origin", "*");
  responseHeaders.set("Access-Control-Allow-Headers", "Authorization, *");
  return {
    req,
    env,
    resHeaders: responseHeaders,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
