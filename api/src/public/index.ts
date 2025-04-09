import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../utils/dbtypes.ts";
import { publicOpts } from "./context.ts";
import { robots } from "./robots.ts";
import { schedule } from "./schedule.ts";

export const publicRouter = async (opts: publicOpts): Promise<Response> => {
  switch (opts.path[0]) {
    case "robots": {
      return await authedPublicEndpoint(opts, robots);
    }
    case "schedule": {
      return await publicPublicEndpoint(opts, schedule);
    }
    default: {
      return new Response(
        JSON.stringify({
          error: "404 Not Found",
          errorMessage: `The requested endpoint ${new URL(opts.request.url).pathname} does not exist `,
        }),
        {
          status: 404,
          statusText: "Not Found",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
};

export const authedPublicEndpoint = async (
  opts: publicOpts,
  endpoint: (opts: publicOpts) => Promise<Response>
): Promise<Response> => {
  let token;
  if (opts.request.headers.has("Authorization")) {
    token = opts.request.headers.get("Authorization")?.split(" ")[1];
  } else if (opts.params.has("token")) {
    token = opts.params.get("token");
  }

  if (token) {
    let tokenPayload: JwtPayload & {
      user: {
        username: string;
        permLevel: User["permLevel"];
      };
    };
    try {
      tokenPayload = jwt.verify(
        token,
        opts.env.JWT_PRIVATE_KEY
      ) as JwtPayload & {
        user: {
          username: string;
          permLevel: User["permLevel"];
        };
      };
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "401 Unauthorized",
          errorMessage: "Token could not be verified.",
        }),
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user = await opts.env.DB.prepare(
      "SELECT username, permLevel, teamNumber FROM Users WHERE username = ? LIMIT 1"
    )
      .bind(tokenPayload.user.username)
      .run<User>();
    if (!user.success || user.results[0] === undefined) {
      return new Response(
        JSON.stringify({
          error: "401 Unauthorized",
          errorMessage: "User account not found.",
        }),
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (user.results[0].permLevel !== tokenPayload.user.permLevel) {
      return new Response(
        JSON.stringify({
          error: "401 Unauthorized",
          errorMessage: "Token permLevel does not match database.",
        }),
        {
          status: 401,
          statusText: "Unauthorized",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return await endpoint({
      request: opts.request,
      path: opts.path,
      params: opts.params,
      env: opts.env,
      ctx: {
        ...opts.ctx,
        user: {
          username: user.results[0].username,
          permLevel: user.results[0].permLevel,
          teamNumber: user.results[0].teamNumber,
        },
      },
    });
  }
  return new Response(
    JSON.stringify({
      error: "401 Unauthorized",
      errorMessage: "Missing access token.",
    }),
    {
      status: 401,
      statusText: "Unauthorized",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const publicPublicEndpoint = async (
  opts: publicOpts,
  endpoint: (opts: publicOpts) => Promise<Response>
): Promise<Response> => {
  return await endpoint({
    request: opts.request,
    path: opts.path,
    params: opts.params,
    env: opts.env,
    ctx: {
      ...opts.ctx,
      user: {
        username: "",
        permLevel: "none",
        teamNumber: 0,
      },
    },
  });
};
