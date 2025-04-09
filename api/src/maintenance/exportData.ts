import { TRPCError } from "@trpc/server";
import { authedLoggedProcedure } from "../trpc.ts";
import {
  TeamMatchEntry,
  TeamMatchEntryColumns,
  TeamMatchEntryInit,
} from "../utils/dbtypes.ts";

export const exportData = authedLoggedProcedure.query(async (opts) => {
  if (opts.ctx.user.permLevel !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Wrong permissions to export data.",
    });
  }

  const teamMatchEntries = await opts.ctx.env.DB.prepare(
    "SELECT * FROM TeamMatchEntry;"
  ).all();
  const users = await opts.ctx.env.DB.prepare("SELECT * FROM Users;").all();
  const events = await opts.ctx.env.DB.prepare("SELECT * FROM Events;").all();
  const matches = await opts.ctx.env.DB.prepare("SELECT * FROM Matches;").all();

  if (
    teamMatchEntries.success &&
    users.success &&
    events.success &&
    matches.success
  ) {
    return {
      TeamMatchEntry: teamMatchEntries.results.map((entry) => {
        const newEntry: TeamMatchEntry = { ...TeamMatchEntryInit };
        TeamMatchEntryColumns.forEach((column) => {
          if (entry[column] === null) {
            newEntry[column] = entry[column] as never;
          } else if (
            typeof TeamMatchEntryInit[column] === "boolean" ||
            [
              "tbaAutoLine",
              "tbaEndgamePark",
              "tbaEndgameShallow",
              "tbaEndgameDeep",
            ].includes(column)
          ) {
            newEntry[column] = (entry[column] === 1) as never;
          } else {
            newEntry[column] = entry[column] as never;
          }
        });
        return newEntry;
      }),
      Users: users.results,
      Events: events.results,
      Matches: matches.results,
    };
  } else {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve data from database",
    });
  }
});
