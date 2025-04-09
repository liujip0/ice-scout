import { D1PreparedStatement } from "@cloudflare/workers-types";
import { z } from "zod";
import { loggedPublicProcedure } from "../trpc.ts";
import {
  TeamMatchEntryColumns,
  TeamMatchEntrySchema,
} from "../utils/dbtypes.ts";

export const putEntries = loggedPublicProcedure
  .input(z.array(TeamMatchEntrySchema))
  .mutation(async (opts) => {
    console.log(opts.input);
    const boundStmts: D1PreparedStatement[] = [];

    const teamMatchEntryStmt = opts.ctx.env.DB.prepare(
      `REPLACE INTO
        TeamMatchEntry(
          ${TeamMatchEntryColumns.join(", ")}
        )
      VALUES
        (${new Array(TeamMatchEntryColumns.length).fill("?").join(",")});`
    );

    for (let match of opts.input) {
      boundStmts.push(
        teamMatchEntryStmt.bind(
          ...TeamMatchEntryColumns.map((column) => match[column])
        )
      );
    }

    await opts.ctx.env.DB.batch(boundStmts);
  });
