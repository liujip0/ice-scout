import { D1Database, D1Result } from "@cloudflare/workers-types";
import {
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
} from "../utils/dbtypes.ts";
import { dateFileName } from "../utils/utils.ts";
import { publicOpts } from "./context.ts";

export const robots = async (opts: publicOpts): Promise<Response> => {
  if (
    opts.ctx.user === null ||
    (opts.ctx.user?.permLevel !== "team" &&
      opts.ctx.user?.permLevel !== "datamanage" &&
      opts.ctx.user?.permLevel !== "admin")
  ) {
    return new Response(
      JSON.stringify({
        error: "403 Forbidden",
        errorMessage: "Wrong permissions to fetch data.",
      }),
      {
        status: 403,
        statusText: "Forbidden",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const renameColumns: Record<string, string> = {};
  opts.params.getAll("rename").forEach((item) => {
    const column = item.split(".");
    renameColumns[column[0]] = column[1];
  });
  let columns: string[] = [...TeamMatchEntryColumns];

  if (
    opts.params.has("include") &&
    opts.params.get("include")?.length &&
    opts.params.get("include")!.length <= TeamMatchEntryColumns.length
  ) {
    const newColumns: string[] = [];
    const include = opts.params.get("include")!;
    for (let i = 0; i < columns.length; i++) {
      if (include[i] === "1") {
        newColumns.push(
          columns[i] +
            (renameColumns[columns[i]] !== undefined ?
              ` AS ${renameColumns[columns[i]]}`
            : "")
        );
      }
    }
    columns = newColumns;
  }

  const results = await getRobotData(
    columns,
    opts.params.getAll("event"),
    opts.params.getAll("team"),
    opts.env.DB
  );

  if (results.success) {
    switch (opts.path[1]) {
      case "json": {
        return new Response(JSON.stringify(results.results), {
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      case "csv": {
        return new Response(
          columns
            .map((column) =>
              column.includes(" AS ") ? column.split(" AS ")[1] : column
            )
            .join(",") +
            "\n" +
            results.results
              .map((row) =>
                columns
                  .map((column) => {
                    const value =
                      column.includes(" AS ") ?
                        row[column.split(" AS ")[0] as TeamMatchEntryColumn]
                      : row[column as TeamMatchEntryColumn];
                    if (typeof value === "string") {
                      return '"' + value.replace(/\n/g, " ") + '"';
                    } else {
                      return value;
                    }
                  })
                  .join(",")
              )
              .join("\n"),
          {
            status: 200,
            statusText: "OK",
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="${dateFileName()}.csv"`,
            },
          }
        );
      }
      case "xlsx": {
        //TODO: make xlsx response
        return new Response("XLSX");
      }
      default: {
        return new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      }
    }
  } else {
    return new Response(
      JSON.stringify({
        error: "500 Internal Server Error",
        errorMessage: "Error while fetching data from server",
      }),
      {
        status: 500,
        statusText: "Internal Server Error",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export const getRobotData = async (
  columns: string[],
  events: string[],
  teams: string[],
  DB: D1Database
): Promise<D1Result<TeamMatchEntry>> => {
  let query = `SELECT ${columns.join(", ")}
            FROM TeamMatchEntry
            WHERE (`;
  const bindParams: string[] = [];

  if (events.length > 0 && !events.every((event) => event === "")) {
    query += events
      .map((value) => {
        bindParams.push(value);
        return "eventKey = ?";
      })
      .join(" OR ");
  } else {
    query += "1";
  }
  query += ") AND (";

  if (teams.length > 0 && !teams.every((team) => team === "")) {
    query += teams
      .map((value) => {
        bindParams.push(value);
        return "teamNumber = ?";
      })
      .join(" OR ");
  } else {
    query += "1";
  }
  query += ")";

  return await DB.prepare(query)
    .bind(...bindParams)
    .all<TeamMatchEntry>();
};
