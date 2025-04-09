import { z } from "zod";

export const Alliance = ["Red", "Blue"] as const;
export const MatchLevel = ["QUALIFICATION", "PLAYOFF"] as const;

export const CommonEntrySchema = z.object({
  eventKey: z.string(),
  matchLevel: z.union([z.literal("QUALIFICATION"), z.literal("PLAYOFF")]),
  matchNumber: z.number().int().nonnegative(),
  teamNumber: z.number().int().nonnegative(),
  alliance: z.union([z.literal("Red"), z.literal("Blue")]),
  robotNumber: z.union([z.literal(1), z.literal(2)]),
  deviceTeamNumber: z.number().int().nonnegative(),
  deviceId: z.string(),
  scoutTeamNumber: z.number().int().nonnegative(),
  scoutName: z.string(),
  flag: z.string(),
});
export type CommonEntry = z.infer<typeof CommonEntrySchema>;
export type CommonEntryColumn = keyof CommonEntry;
export const CommonEntryColumns: CommonEntryColumn[] = [
  "eventKey",
  "matchLevel",
  "matchNumber",
  "teamNumber",
  "alliance",
  "robotNumber",
  "deviceTeamNumber",
  "deviceId",
  "scoutTeamNumber",
  "scoutName",
  "flag",
] as CommonEntryColumn[];

export const TeamMatchEntrySchema = CommonEntrySchema.omit({
  robotNumber: true,
}).extend({
  robotNumber: z.union([z.literal(1), z.literal(2)]),

  noShow: z.boolean(),
  died: z.boolean().nullable(),
  comments: z.string().nullable(),

  autoNetZoneSamp: z.number().int().nonnegative().nullable(),
  autoLowBasketSamp: z.number().int().nonnegative().nullable(),
  autoHighBasketSamp: z.number().int().nonnegative().nullable(),
  autoLowChamberSpec: z.number().int().nonnegative().nullable(),
  autoHighChamberSpec: z.number().int().nonnegative().nullable(),
  autoObservationZone: z.boolean().nullable(),
  autoL1Climb: z.boolean().nullable(),

  teleopNetZoneSamp: z.number().int().nonnegative().nullable(),
  teleopLowBasketSamp: z.number().int().nonnegative().nullable(),
  teleopHighBasketSamp: z.number().int().nonnegative().nullable(),
  teleopLowChamberSpec: z.number().int().nonnegative().nullable(),
  teleopHighChamberSpec: z.number().int().nonnegative().nullable(),

  endgameObservationZone: z.boolean().nullable(),
  endgameL1Climb: z.boolean().nullable(),
  endgameL2Climb: z.boolean().nullable(),
  endgameL3Climb: z.boolean().nullable(),
});
export type TeamMatchEntry = z.infer<typeof TeamMatchEntrySchema>;
export type TeamMatchEntryColumn = keyof TeamMatchEntry;
export const TeamMatchEntryColumns: TeamMatchEntryColumn[] = [
  ...CommonEntryColumns,

  "noShow",
  "died",
  "comments",

  "autoNetZoneSamp",
  "autoLowBasketSamp",
  "autoHighBasketSamp",
  "autoLowChamberSpec",
  "autoHighChamberSpec",
  "autoObservationZone",
  "autoL1Climb",

  "teleopNetZoneSamp",
  "teleopLowBasketSamp",
  "teleopHighBasketSamp",
  "teleopLowChamberSpec",
  "teleopHighChamberSpec",

  "endgameObservationZone",
  "endgameL1Climb",
  "endgameL2Climb",
  "endgameL3Climb",
] as TeamMatchEntryColumn[];
export const TeamMatchEntryInit: TeamMatchEntry = {
  eventKey: "",
  matchLevel: "QUALIFICATION",
  matchNumber: 1,
  teamNumber: 0,
  alliance: "Red",
  robotNumber: 1,
  deviceTeamNumber: 0,
  deviceId: "",
  scoutTeamNumber: 11329,
  scoutName: "",
  flag: "",

  noShow: false,
  died: false,
  comments: "",

  autoNetZoneSamp: 0,
  autoLowBasketSamp: 0,
  autoHighBasketSamp: 0,
  autoLowChamberSpec: 0,
  autoHighChamberSpec: 0,
  autoObservationZone: false,
  autoL1Climb: false,

  teleopNetZoneSamp: 0,
  teleopLowBasketSamp: 0,
  teleopHighBasketSamp: 0,
  teleopLowChamberSpec: 0,
  teleopHighChamberSpec: 0,

  endgameObservationZone: false,
  endgameL1Climb: false,
  endgameL2Climb: false,
  endgameL3Climb: false,
};
export const TeamMatchEntryNoShowInit: TeamMatchEntry = {
  eventKey: "",
  matchLevel: "QUALIFICATION",
  matchNumber: 1,
  teamNumber: 0,
  alliance: "Red",
  robotNumber: 1,
  deviceTeamNumber: 0,
  deviceId: "",
  scoutTeamNumber: 11329,
  scoutName: "",
  flag: "",

  noShow: true,
  died: null,
  comments: null,

  autoNetZoneSamp: null,
  autoLowBasketSamp: null,
  autoHighBasketSamp: null,
  autoLowChamberSpec: null,
  autoHighChamberSpec: null,
  autoObservationZone: null,
  autoL1Climb: null,

  teleopNetZoneSamp: null,
  teleopLowBasketSamp: null,
  teleopHighBasketSamp: null,
  teleopLowChamberSpec: null,
  teleopHighChamberSpec: null,

  endgameObservationZone: null,
  endgameL1Climb: null,
  endgameL2Climb: null,
  endgameL3Climb: null,
};

export const UserPermLevel = [
  "none",
  "demo",
  "team",
  "datamanage",
  "admin",
] as const;
export const UserSchema = z.object({
  username: z.string(),
  permLevel: z.union([
    z.literal("none"),
    z.literal("demo"),
    z.literal("team"),
    z.literal("datamanage"),
    z.literal("admin"),
  ]),
  teamNumber: z.number().int().nonnegative(),
  hashedPassword: z.string(),
});
export type User = z.infer<typeof UserSchema>;
export type UserColumn = keyof User;
export const UserColumns: UserColumn[] = [
  "username",
  "permLevel",
  "teamNumber",
  "hashedPassword",
];

export const DBEventSchema = z.object({
  eventKey: z.string(),
  eventName: z.string(),
});
export type DBEvent = z.infer<typeof DBEventSchema>;
export type DBEventColumn = keyof DBEvent;
export const DBEventColumns: DBEventColumn[] = ["eventKey", "eventName"];

export const MatchSchema = z.object({
  eventKey: z.string(),
  matchLevel: z.union([z.literal("QUALIFICATION"), z.literal("PLAYOFF")]),
  matchNumber: z.number().int().nonnegative(),
  red1: z.number().int().nonnegative(),
  red2: z.number().int().nonnegative(),
  blue1: z.number().int().nonnegative(),
  blue2: z.number().int().nonnegative(),
});
export type Match = z.infer<typeof MatchSchema>;
export type MatchColumn = keyof Match;
export const MatchColumns: MatchColumn[] = [
  "eventKey",
  "matchLevel",
  "matchNumber",
  "red1",
  "red2",
  "blue1",
  "blue2",
];
