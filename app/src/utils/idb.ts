import {
  DBEvent,
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
  await db.put(Stores.TeamMatchEntry, match);
};

export const deleteEntry = async (match: TeamMatchEntry | ExportMatchEntry) => {
  const db = await openDB<ISAIDBSchema>(dbname, version);
  db.delete(Stores.TeamMatchEntry, [
    match.eventKey,
    match.matchLevel,
    match.matchNumber,
    match.teamNumber,
    match.deviceTeamNumber,
    match.deviceId,
  ]);
};
