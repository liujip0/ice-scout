import type { AppRouter } from "@ice-scout/api/src/router.ts";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
