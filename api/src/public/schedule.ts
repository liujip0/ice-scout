import { getScheduleFromDB } from "../events/getEvent.ts";
import { updateScheduleFromTba } from "../events/getTbaEvent.ts";
import { DBEvent, Match } from "../utils/dbtypes.ts";
import { publicOpts } from "./context.ts";

export const schedule = async (opts: publicOpts): Promise<Response> => {
  if (opts.params.has("event")) {
    const scheduleRes = await updateScheduleFromTba(
      opts.params.get("event")!,
      opts.env
    );
    let scheduleData: DBEvent & { matches: Match[] };

    if (scheduleRes.status === 200) {
      scheduleData = scheduleRes.data!;
    } else if (scheduleRes.status === 404) {
      const isaScheduleRes = await getScheduleFromDB(
        opts.params.get("event")!,
        opts.env
      );
      if (isaScheduleRes.status === 200) {
        scheduleData = isaScheduleRes.data!;
      } else {
        return new Response(
          JSON.stringify({
            error: isaScheduleRes.status.toString(),
            errorMessage: isaScheduleRes.error,
          }),
          {
            status: isaScheduleRes.status,
            statusText: isaScheduleRes.error,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          error: scheduleRes.status.toString(),
          errorMessage: scheduleRes.error,
        }),
        {
          status: scheduleRes.status,
          statusText: scheduleRes.error,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    switch (opts.path[1]) {
      case "json": {
        return new Response(JSON.stringify(scheduleData), {
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      case "csv": {
        let csvContents =
          "Match Level,Match Number,Red 1,Red 2,Blue 1,Blue 2\n";
        scheduleData.matches.forEach((match) => {
          csvContents +=
            match.matchLevel +
            "," +
            match.matchNumber +
            "," +
            match.red1 +
            "," +
            match.red2 +
            "," +
            match.blue1 +
            "," +
            match.blue2 +
            "\n";
        });
        return new Response(csvContents, {
          status: 200,
          statusText: "OK",
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${scheduleData.eventKey}.csv"`,
          },
        });
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
        error: "400 Bad Request",
        errorMessage: "No event specified",
      }),
      {
        status: 400,
        statusText: "Bad Request",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
