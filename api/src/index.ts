import { D1Database } from "@cloudflare/workers-types";
import {
  FetchCreateContextFnOptions,
  fetchRequestHandler,
} from "@trpc/server/adapters/fetch";
import { createContext } from "./context.ts";
import { createWebhooksContext } from "./hooks/context.ts";
import { hooksRouter } from "./hooks/index.ts";
import { createPublicContext } from "./public/context.ts";
import { publicRouter } from "./public/index.ts";
import { appRouter } from "./router.ts";

export interface Env {
  DB: D1Database;

  ADMIN_ACCOUNT_USERNAME: string;
  ADMIN_ACCOUNT_PASSWORD: string;

  JWT_PRIVATE_KEY: string;

  FIRST_API_TOKEN: string;
  TBA_API_TOKEN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      const response = new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Authorization, *",
        },
      });
      return response;
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith("/public")) {
      return await createPublicContext(
        request,
        url.pathname.split("/").filter((x) => x !== "" && x !== "public"),
        url.searchParams,
        env,
        publicRouter
      );
    }

    if (url.pathname.startsWith("/hooks")) {
      return await createWebhooksContext(
        request,
        url.pathname.split("/").filter((x) => x !== "" && x !== "hooks"),
        env,
        hooksRouter
      );
    }

    return fetchRequestHandler({
      endpoint: "/api",
      req: request,
      router: appRouter,
      createContext: (options: FetchCreateContextFnOptions) =>
        createContext({
          ...options,
          env,
        }),
    });
  },
};
