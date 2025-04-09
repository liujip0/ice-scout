import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Env } from "../index.ts";
import { loggedPublicProcedure } from "../trpc.ts";
import { DBEvent, Match } from "../utils/dbtypes.ts";

export const getEvent = loggedPublicProcedure
  .input(z.string())
  .mutation(async (opts) => {
    const res = await getScheduleFromDB(opts.input, opts.ctx.env);
    switch (res.status) {
      case 200: {
        return res.data!;
      }
      case 404: {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not in ISA database. Try FRC Events API.",
        });
      }
      case 500: {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error while fetching schedule.",
        });
      }
      default: {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error while fetching schedule.",
        });
      }
    }
  });

export const getScheduleFromDB = async (
  eventKey: string,
  env: Env
): Promise<
  | {
      status: 200;
      data: DBEvent & { matches: Match[] };
    }
  | {
      status: 401 | 404 | 500;
      error: string;
    }
> => {
  const event = await env.DB.prepare(
    "SELECT eventKey, eventName from Events WHERE eventKey = ? LIMIT 1;"
  )
    .bind(eventKey)
    .first<DBEvent>();

  if (event) {
    const matches = await env.DB.prepare(
      `SELECT eventKey, matchLevel, matchNumber, red1, red2, blue1, blue2
        FROM Matches
        WHERE eventKey = ?;`
    )
      .bind(eventKey)
      .all<Match>();

    if (matches.success) {
      return {
        status: 200,
        data: {
          ...event,
          matches: matches.results,
        },
      };
    } else {
      return {
        status: 500,
        error: "Error while fetching matches.",
      };
    }
  } else {
    return {
      status: 404,
      error: "Event not found.",
    };
  }
};
