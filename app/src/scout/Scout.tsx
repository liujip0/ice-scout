import { MAX_TEAM_NUMBER } from "@ice-scout/api/src/utils/constants.ts";
import {
  Alliance,
  DBEvent,
  Match,
  TeamMatchEntry,
  TeamMatchEntryInit,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import EventEmitter from "events";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";
import SavedMatches from "./SavedMatches.tsx";
import ScoutLayout from "./ScoutLayout.tsx";

type ScoutProps = {
  deviceSetup: DeviceSetupObj;
  events: (DBEvent & { matches: Match[] })[];
  eventEmitter: EventEmitter;
};
export default function Scout({
  deviceSetup,
  events,
  eventEmitter,
}: ScoutProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !deviceSetup.currentEvent ||
      !Number.isInteger(deviceSetup.deviceTeamNumber) ||
      !deviceSetup.deviceTeamNumber ||
      deviceSetup.deviceTeamNumber < 1 ||
      deviceSetup.deviceTeamNumber > MAX_TEAM_NUMBER ||
      !deviceSetup.deviceId ||
      !Alliance.includes(deviceSetup.alliance) ||
      (deviceSetup.robotNumber !== 1 &&
        deviceSetup.robotNumber !== 2 &&
        deviceSetup.robotNumber !== 3 &&
        deviceSetup.robotNumber !== 4)
    ) {
      navigate("/setup");
    }
  }, [deviceSetup, navigate]);

  const [match, setMatch] = useState<TeamMatchEntry>(() => {
    const newMatch: TeamMatchEntry = {
      ...TeamMatchEntryInit,
      eventKey: deviceSetup.currentEvent,
      alliance: deviceSetup.alliance,
      robotNumber: deviceSetup.robotNumber as 1 | 2,
      deviceTeamNumber: deviceSetup.deviceTeamNumber,
      deviceId: deviceSetup.deviceId,
    };

    const eventMatches = events.find(
      (event) => event.eventKey === deviceSetup.currentEvent
    )?.matches;
    if (
      eventMatches?.some(
        (x) =>
          x.matchLevel === TeamMatchEntryInit.matchLevel &&
          x.matchNumber === TeamMatchEntryInit.matchNumber
      )
    ) {
      return {
        ...newMatch,
        teamNumber: eventMatches.find(
          (x) =>
            x.matchLevel === TeamMatchEntryInit.matchLevel &&
            x.matchNumber === TeamMatchEntryInit.matchNumber
        )![
          (deviceSetup.alliance.toLowerCase() + deviceSetup.robotNumber) as
            | "red1"
            | "red2"
            | "blue1"
            | "blue2"
        ],
      };
    } else {
      return newMatch;
    }
  });
  useEffect(() => {
    if (eventEmitter.listenerCount("idb-finished") === 0) {
      eventEmitter.on(
        "idb-finished",
        (eventsFromIdb: (DBEvent & { matches: Match[] })[]) => {
          const eventMatches = eventsFromIdb.find(
            (event) => event.eventKey === match.eventKey
          )?.matches;
          if (
            eventMatches?.some(
              (x) =>
                x.matchLevel === match.matchLevel &&
                x.matchNumber === match.matchNumber
            )
          ) {
            setMatch({
              ...match,
              teamNumber: eventMatches.find(
                (x) =>
                  x.matchLevel === match.matchLevel &&
                  x.matchNumber === match.matchNumber
              )![
                (match.alliance.toLowerCase() + match.robotNumber) as
                  | "red1"
                  | "red2"
                  | "blue1"
                  | "blue2"
              ],
            });
          }
        }
      );
    }
  }, [eventEmitter, match]);

  const [putEntriesPending, setPutEntriesPending] = useState(false);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ScoutLayout
            match={match}
            setMatch={setMatch}
            events={events}
            deviceSetup={deviceSetup}
            putEntriesPending={putEntriesPending}
            setPutEntriesPending={setPutEntriesPending}
            eventEmitter={eventEmitter}
          />
        }
      />
      <Route
        path="savedmatches"
        element={
          <SavedMatches
            match={match}
            setMatch={setMatch}
            events={events}
          />
        }
      />
    </Routes>
  );
}
