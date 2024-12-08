import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Env } from "./index.ts";

export const createContext = async ({
  req,
  env,
  resHeaders,
}: FetchCreateContextFnOptions & { env: Env }) => {
  const responseHeaders = resHeaders;
  responseHeaders.set(
    "Access-Control-Allow-Origin",
    "https://isa2025.pages.dev"
  );
  return {
    req,
    env,
    responseHeaders,
  };
};
export type Context = Awaited<ReturnType<typeof createContext>>;
