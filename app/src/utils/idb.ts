import {
  DBEvent,
  HumanPlayerEntry,
  Match,
  MatchLevel,
  TeamMatchEntry,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { DBSchema, openDB } from "idb";
import { ExportMatchEntry } from "../scout/SavedMatches.tsx";

const version = 4;
const dbname = "ice-scout-idb";

export enum Stores {
  Events = "DBEvents",
  Matches = "Matches",
  TeamMatchEntry = "TeamMatchEntry",
  HumanPlayerEntry = "HumanPlayerEntry",
}

interface ISAIDBSchema extends DBSchema {
  DBEvents: {
    key: string;
    value: DBEvent;
  };
  Matches: {
    key: [string, string, number];
    value: Match;
  };
  TeamMatchEntry: {
    key: [string, (typeof MatchLevel)[number], number, number, number, string];
    value: TeamMatchEntry & {
      autoUpload: boolean;
      quickshare: boolean;
      clipboard: boolean;
      qr: boolean;
      download: boolean;
      upload: boolean;
    };
  };
  HumanPlayerEntry: {
    key: [string, (typeof MatchLevel)[number], number, number, number, string];
    value: HumanPlayerEntry & {
      autoUpload: boolean;
      quickshare: boolean;
      clipboard: boolean;
      qr: boolean;
      download: boolean;
      upload: boolean;
    };
  };
}

export const initDB = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const dbReq = indexedDB.open(dbname, version);
    dbReq.onupgradeneeded = () => {
      const db = dbReq.result;
      if (!db.objectStoreNames.contains(Stores.Events)) {
        db.createObjectStore(Stores.Events, {
          keyPath: "eventKey",
        });
      }
      if (!db.objectStoreNames.contains(Stores.Matches)) {
        db.createObjectStore(Stores.Matches, {
          keyPath: ["eventKey", "matchLevel", "matchNumber"],
        });
      }
      if (!db.objectStoreNames.contains(Stores.TeamMatchEntry)) {
        db.createObjectStore(Stores.TeamMatchEntry, {
          keyPath: [
            "eventKey",
            "matchLevel",
            "matchNumber",
            "teamNumber",
            "deviceTeamNumber",
            "deviceId",
          ],
        });
      }
      if (!db.objectStoreNames.contains(Stores.HumanPlayerEntry)) {
        db.createObjectStore(Stores.HumanPlayerEntry, {
          keyPath: [
            "eventKey",
            "matchLevel",
            "matchNumber",
            "teamNumber",
            "deviceTeamNumber",
            "deviceId",
          ],
        });
      }
    };
    dbReq.onsuccess = () => {
      resolve(true);
    };
    dbReq.onerror = () => {
      reject();
    };
  });
};

export const getDBEvents = async () => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  const res = await db.getAll(Stores.Events);
  return res;
};
export const getDBMatches = async () => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  const res = await db.getAll(Stores.Matches);
  return res;
};
export const getDBTeamMatchEntries = async () => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  const res = await db.getAll(Stores.TeamMatchEntry);
  return res;
};
export const getDBHumanPlayerEntries = async () => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  const res = await db.getAll(Stores.HumanPlayerEntry);
  return res.map((entry) =>
    entry.teamNumber === 0 ?
      {
        ...entry,
        teamNumber: null,
      }
    : entry
  );
};

export const putDBEvent = async (event: DBEvent) => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  await db.put(Stores.Events, event);
};

export const putDBMatches = async (matches: Match[]) => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  const tx = db.transaction(Stores.Matches, "readwrite");
  for (let i = 0; i < matches.length; i++) {
    await tx.objectStore(Stores.Matches).put(matches[i]);
  }
  await tx.done;
};

export const putDBEntry = async (match: ExportMatchEntry) => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  if (match.robotNumber !== 4) {
    await db.put(Stores.TeamMatchEntry, match);
  } else {
    await db.put(Stores.HumanPlayerEntry, {
      ...match,
      teamNumber: match.teamNumber || 0,
    });
  }
};

export const deleteEntry = async (
  match: HumanPlayerEntry | TeamMatchEntry | ExportMatchEntry
) => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  if (match.robotNumber !== 4) {
    db.delete(Stores.TeamMatchEntry, [
      match.eventKey,
      match.matchLevel,
      match.matchNumber,
      match.teamNumber,
      match.deviceTeamNumber,
      match.deviceId,
    ]);
  } else {
    db.delete(Stores.HumanPlayerEntry, [
      match.eventKey,
      match.matchLevel,
      match.matchNumber,
      match.teamNumber || 0,
      match.deviceTeamNumber,
      match.deviceId,
    ]);
  }
};
