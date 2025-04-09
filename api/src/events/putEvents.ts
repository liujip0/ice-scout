import { D1PreparedStatement } from "@cloudflare/workers-types";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import {
  DBEvent,
  DBEventSchema,
  Match,
  MatchSchema,
} from "../utils/dbtypes.ts";
import { omit } from "../utils/utils.ts";

export const putEvents = loggedPublicProcedure
  .input(
    z.array(
      DBEventSchema.extend({
        matches: z.array(MatchSchema),
      })
    )
  )
  .mutation(async (opts) => {
    const events: DBEvent[] = [];
    const matches: Match[] = [];

    opts.input.forEach((event) => {
      events.push(omit(["matches"], event) as DBEvent);
      event.matches.forEach((match) => {
        matches.push(match);
      });
    });

    const boundStmts: D1PreparedStatement[] = [];

    const eventStmt = opts.ctx.env.DB.prepare(
      `REPLACE INTO
        Events(eventKey, eventName)
      VALUES (?, ?);`
    );
    events.forEach((event) => {
      boundStmts.push(eventStmt.bind(event.eventKey, event.eventName));
    });

    const matchStmt = opts.ctx.env.DB.prepare(
      `REPLACE INTO
        Matches(eventKey, matchLevel, matchNumber, red1, red2, blue1, blue2)
      VALUES (?, ?, ?, ?, ?, ?, ?);`
    );
    matches.forEach((match) => {
      boundStmts.push(
        matchStmt.bind(
          match.eventKey,
          match.matchLevel,
          match.matchNumber,
          match.red1,
          match.red2,
          match.blue1,
          match.blue2
        )
      );
    });

    await opts.ctx.env.DB.batch(boundStmts);
  });
