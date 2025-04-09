import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedLoggedProcedure } from "../trpc.ts";
import {
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
} from "../utils/dbtypes.ts";

export const data = authedLoggedProcedure
  .input(
    z.object({
      events: z.array(z.string()).nonempty().optional(),
      teams: z.array(z.number().positive()).nonempty().optional(),
      include: z.string().length(TeamMatchEntryColumns.length).optional(),
    })
  )
  .query(async (opts) => {
    if (
      opts.ctx.user.permLevel !== "demo" &&
      opts.ctx.user.permLevel !== "team" &&
      opts.ctx.user.permLevel !== "datamanage" &&
      opts.ctx.user.permLevel !== "admin"
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Wrong permissions to fetch data.",
      });
    }

    let columns: TeamMatchEntryColumn[] = [...TeamMatchEntryColumns];

    if (opts.input.include) {
      const newColumns: TeamMatchEntryColumn[] = [];
      const include = opts.input.include!;
      for (let i = 0; i < columns.length; i++) {
        if (include[i] === "1") {
          newColumns.push(columns[i]);
        }
      }
      columns = newColumns;
    }

    let query = `SELECT ${columns.join(", ")}
                FROM TeamMatchEntry
                WHERE (`;
    const bindParams: string[] = [];

    if (opts.input.events) {
      query += opts.input.events
        .map((value) => {
          bindParams.push(value);
          return "eventKey = ?";
        })
        .join(" OR ");
    } else {
      query += "1";
    }
    query += ") AND (";

    if (opts.input.teams) {
      query += opts.input.teams
        .map((value) => {
          bindParams.push(value.toString());
          return "teamNumber = ?";
        })
        .join(" OR ");
    } else {
      query += "1";
    }
    query += ")";

    const results = await opts.ctx.env.DB.prepare(query)
      .bind(...bindParams)
      .all<TeamMatchEntry>();

    if (results.success) {
      return results.results;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error while fetching data.",
    });
  });
