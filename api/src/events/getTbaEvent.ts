import { D1PreparedStatement } from "@cloudflare/workers-types";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Env } from "../index.ts";
import { loggedPublicProcedure } from "../trpc.ts";
import { DBEvent, Match, MatchLevel } from "../utils/dbtypes.ts";
import { getScheduleFromDB } from "./getEvent.ts";

export const getTbaEvent = loggedPublicProcedure
  .input(z.string())
  .mutation(async (opts) => {
    const res = await updateScheduleFromTba(opts.input, opts.ctx.env);

    switch (res.status) {
      case 200: {
        return res.data!;
      }
      case 404: {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Event not found on TBA.",
        });
      }
      default: {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error while pulling schedule from TBA",
        });
      }
    }
  });

type TbaSimpleMatch = {
  comp_level: "qm" | "ef" | "qf" | "sf" | "f";
  match_number: number;
  alliances: {
    red: {
      team_keys: [string, string, string];
    };
    blue: {
      team_keys: [string, string, string];
    };
  };
  event_key: string;
};
export const updateScheduleFromTba = async (
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
  const etag = await env.KV.get("tba-etag");
  const eventRes = await fetch(
    "https://www.thebluealliance.com/api/v3/event/" +
      eventKey +
      "/matches/simple",
    {
      method: "GET",
      headers:
        etag ?
          {
            "X-TBA-Auth-Key": env.TBA_API_TOKEN,
            "If-None-Match": etag,
          }
        : {
            "X-TBA-Auth-Key": env.TBA_API_TOKEN,
          },
    }
  );

  switch (eventRes.status) {
    case 200: {
      const eventInfoRes = await fetch(
        "https://www.thebluealliance.com/api/v3/event/" + eventKey + "/simple",
        {
          method: "GET",
          headers:
            etag ?
              {
                "X-TBA-Auth-Key": env.TBA_API_TOKEN,
                "If-None-Match": etag,
              }
            : {
                "X-TBA-Auth-Key": env.TBA_API_TOKEN,
              },
        }
      );
      console.log(eventInfoRes.status);

      const event: DBEvent & { matches: Match[] } = {
        eventKey: eventKey,
        eventName:
          eventInfoRes.status === 200 ? (await eventInfoRes.json()).name : "",
        matches: [],
      };

      if (eventRes.headers.has("ETag")) {
        await env.KV.put("tba-etag", eventRes.headers.get("ETag")!);
      }
      const eventBody: TbaSimpleMatch[] = await eventRes.json();

      const boundStmts: D1PreparedStatement[] = [];
      boundStmts.push(
        env.DB.prepare(
          "REPLACE INTO Events(eventKey, eventName) VALUES(?, ?);"
        ).bind(event.eventKey, event.eventName)
      );

      eventBody.forEach((match) => {
        event.matches.push({
          eventKey: match.event_key,
          matchLevel: {
            qm: "Qualification",
            ef: "Playoff",
            qf: "Playoff",
            sf: "Playoff",
            f: "Playoff",
          }[match.comp_level] as (typeof MatchLevel)[number],
          matchNumber: match.match_number,
          red1: parseInt(match.alliances.red.team_keys[0].replace("frc", "")),
          red2: parseInt(match.alliances.red.team_keys[1].replace("frc", "")),
          blue1: parseInt(match.alliances.blue.team_keys[0].replace("frc", "")),
          blue2: parseInt(match.alliances.blue.team_keys[1].replace("frc", "")),
        });
      });

      event.matches.forEach((match) => {
        boundStmts.push(
          env.DB.prepare(
            `REPLACE INTO
            Matches(eventKey, matchLevel, matchNumber, red1, red2, blue1, blue2)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`
          ).bind(
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

      await env.DB.batch(boundStmts);

      return {
        status: 200,
        data: event,
      };
    }
    case 304: {
      const dbSchedule = await getScheduleFromDB(eventKey, env);
      switch (dbSchedule.status) {
        case 200: {
          return {
            status: 200,
            data: dbSchedule.data!,
          };
        }
        case 404: {
          //TODO: refetch from TBA
          return {
            status: 404,
            error: "TBA status 304. Event not found in DB.",
          };
        }
        default: {
          return {
            status: 500,
            error: "TBA status 304. Error while fetching schedule from DB.",
          };
        }
      }
    }
    default: {
      console.log(eventRes.statusText);
      return {
        status: eventRes.status as 401 | 404 | 500,
        error: eventRes.statusText,
      };
    }
  }
};
