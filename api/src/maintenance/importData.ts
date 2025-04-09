import { D1PreparedStatement } from "@cloudflare/workers-types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedLoggedProcedure } from "../trpc.ts";
import {
  DBEventColumns,
  DBEventSchema,
  MatchColumns,
  MatchSchema,
  TeamMatchEntryColumns,
  TeamMatchEntrySchema,
  UserColumns,
  UserSchema,
} from "../utils/dbtypes.ts";

export const importData = authedLoggedProcedure
  .input(
    z.object({
      TeamMatchEntry: z.array(TeamMatchEntrySchema),
      Users: z.array(UserSchema),
      Events: z.array(DBEventSchema),
      Matches: z.array(MatchSchema),
    })
  )
  .mutation(async (opts) => {
    if (opts.ctx.user.permLevel !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Wrong permissions to import data.",
      });
    }

    const boundStmts: D1PreparedStatement[] = [];

    const teamMatchEntries = opts.ctx.env.DB.prepare(
      `INSERT INTO
            TeamMatchEntry(
              ${TeamMatchEntryColumns.join(", ")}
            )
          VALUES
            (${new Array(TeamMatchEntryColumns.length).fill("?").join(",")});`
    );
    opts.input.TeamMatchEntry.forEach((entry) => {
      boundStmts.push(
        teamMatchEntries.bind(
          ...TeamMatchEntryColumns.map((column) => entry[column])
        )
      );
    });

    const users = opts.ctx.env.DB.prepare(
      `INSERT INTO
            Users(
              ${UserColumns.join(", ")}
            )
          VALUES
            (${new Array(UserColumns.length).fill("?").join(",")});`
    );
    opts.input.Users.filter(
      (entry) => entry.username !== opts.ctx.env.ADMIN_ACCOUNT_USERNAME
    ).forEach((entry) => {
      boundStmts.push(
        users.bind(...UserColumns.map((column) => entry[column]))
      );
    });

    const events = opts.ctx.env.DB.prepare(
      `INSERT INTO
            Events(
              ${DBEventColumns.join(", ")}
            )
          VALUES
            (${new Array(DBEventColumns.length).fill("?").join(",")});`
    );
    opts.input.Events.forEach((entry) => {
      boundStmts.push(
        events.bind(...DBEventColumns.map((column) => entry[column]))
      );
    });

    const matches = opts.ctx.env.DB.prepare(
      `INSERT INTO
            Matches(
              ${MatchColumns.join(", ")}
            )
          VALUES
            (${new Array(MatchColumns.length).fill("?").join(",")});`
    );
    opts.input.Matches.forEach((entry) => {
      boundStmts.push(
        matches.bind(...MatchColumns.map((column) => entry[column]))
      );
    });

    await opts.ctx.env.DB.batch(boundStmts);
  });
