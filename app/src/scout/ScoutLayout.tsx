import { MAX_TEAM_NUMBER } from "@ice-scout/api/src/utils/constants.ts";
import {
  DBEvent,
  Match,
  TeamMatchEntry,
  TeamMatchEntryNoShowInit,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import EventEmitter from "events";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceSetupObj } from "../setup/DeviceSetup.tsx";
import { putDBEntry } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import Auto from "./robot/Auto.tsx";
import Postmatch from "./robot/Postmatch.tsx";
import Prematch from "./robot/Prematch.tsx";
import { Teleop } from "./robot/Teleop.tsx";
import { ExportMatchEntry } from "./SavedMatches.tsx";
import { ScoutPageContainer } from "./ScoutPageContainer.tsx";

export type MatchStage = "prematch" | "auto" | "teleop" | "postmatch";
type ScoutLayoutProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  deviceSetup: DeviceSetupObj;
  putEntriesPending: boolean;
  setPutEntriesPending: (value: boolean) => void;
  eventEmitter: EventEmitter;
};
export default function ScoutLayout({
  match,
  setMatch,
  events,
  deviceSetup,
  putEntriesPending,
  setPutEntriesPending,
  eventEmitter,
}: ScoutLayoutProps) {
  const navigate = useNavigate();

  const [matchStage, setMatchStage] = useState<MatchStage>("prematch");
  console.log("match stage: " + matchStage);

  let putEntriesTimeout: NodeJS.Timeout;
  const putEntries = trpc.data.putEntries.useMutation({
    onMutate() {
      clearTimeout(putEntriesTimeout);
      setPutEntriesPending(true);
      putEntriesTimeout = setTimeout(async () => {
        if (putEntriesPending) {
          putEntries.reset();
          await putDBEntry({
            ...match,
            autoUpload: false,
            quickshare: false,
            clipboard: false,
            qr: false,
            download: false,
            upload: false,
          } as ExportMatchEntry);
          navigate("/scout/savedmatches");
        }
      }, 3000);
    },
    async onSuccess() {
      clearTimeout(putEntriesTimeout);
      await putDBEntry({
        ...match,
        autoUpload: true,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportMatchEntry);
      setPutEntriesPending(false);
      navigate("/scout/savedmatches");
    },
    async onError(error) {
      clearTimeout(putEntriesTimeout);
      console.error(error);
      await putDBEntry({
        ...match,
        autoUpload: false,
        quickshare: false,
        clipboard: false,
        qr: false,
        download: false,
        upload: false,
      } as ExportMatchEntry);
      setPutEntriesPending(false);
      navigate("/scout/savedmatches");
    },
  });

  const [matchNumberError, setMatchNumberError] = useState("");
  const [scoutNameError, setScoutNameError] = useState("");
  const [scoutTeamNumberError, setScoutTeamNumberError] = useState("");
  const [teamNumberError, setTeamNumberError] = useState("");

  const prematchCheck = () => {
    let error = false;

    if (!Number.isInteger(match.matchNumber) || match.matchNumber < 1) {
      error = true;
      setMatchNumberError("Invalid match number.");
    } else if (
      !events
        .find((x) => x.eventKey === deviceSetup.currentEvent)
        ?.matches.some(
          (y) =>
            y.matchNumber === match.matchNumber &&
            y.matchLevel === match.matchLevel
        )
    ) {
      if (
        matchNumberError !==
        "Match not in schedule. Press Next again to ignore."
      ) {
        error = true;
      }
      setMatchNumberError("Match not in schedule. Press Next again to ignore.");
    } else {
      setMatchNumberError("");
    }

    if (!match.scoutName) {
      error = true;
      setScoutNameError("Cannot be empty.");
    } else {
      setScoutNameError("");
    }

    if (
      !Number.isInteger(match.scoutTeamNumber) ||
      match.scoutTeamNumber < 1 ||
      match.scoutTeamNumber > MAX_TEAM_NUMBER
    ) {
      error = true;
      setScoutTeamNumberError("Invalid team number.");
    } else {
      setScoutTeamNumberError("");
    }

    if (
      !Number.isInteger(match.teamNumber) ||
      match.teamNumber! < 1 ||
      match.teamNumber! > MAX_TEAM_NUMBER
    ) {
      error = true;
      setTeamNumberError("Invalid team number.");
    } else {
      setTeamNumberError("");
    }

    return error;
  };

  const TELEOP_TAB_FLASH_MS = 750;
  const [teleopTabAnimation, setTeleopTabAnimation] = useState(false);
  const [teleopAnimationBackdrop, setTeleopAnimationBackdrop] = useState(false);
  console.log(teleopTabAnimation, teleopAnimationBackdrop);
  const recurringTeleopAnimation = useRef<NodeJS.Timeout | null>(null);
  const teleopAnimationBackdropTimeout = useRef<NodeJS.Timeout | null>(null);
  const teleopTabAnimation1 = useRef<NodeJS.Timeout | null>(null);
  const teleopTabAnimation2 = useRef<NodeJS.Timeout | null>(null);
  const teleopTabAnimation3 = useRef<NodeJS.Timeout | null>(null);
  const teleopTabAnimation4 = useRef<NodeJS.Timeout | null>(null);
  const teleopTabAnimation5 = useRef<NodeJS.Timeout | null>(null);
  const [teleopAnimationRunning, setTeleopAnimationRunning] = useState(false);
  const clearTeleopAnimations = () => {
    setTeleopAnimationBackdrop(false);
    if (teleopAnimationBackdropTimeout.current) {
      clearInterval(teleopAnimationBackdropTimeout.current);
      teleopAnimationBackdropTimeout.current = null;
    }
    setTeleopTabAnimation(false);
    if (teleopTabAnimation1.current) {
      clearTimeout(teleopTabAnimation1.current);
      teleopTabAnimation1.current = null;
    }
    if (teleopTabAnimation2.current) {
      clearTimeout(teleopTabAnimation2.current);
      teleopTabAnimation2.current = null;
    }
    if (teleopTabAnimation3.current) {
      clearTimeout(teleopTabAnimation3.current);
      teleopTabAnimation3.current = null;
    }
    if (teleopTabAnimation4.current) {
      clearTimeout(teleopTabAnimation4.current);
      teleopTabAnimation4.current = null;
    }
    if (teleopTabAnimation5.current) {
      clearTimeout(teleopTabAnimation5.current);
      teleopTabAnimation5.current = null;
    }

    setTeleopAnimationRunning(false);
  };

  const matchStageRef = useRef(matchStage);
  useEffect(() => {
    matchStageRef.current = matchStage;
  }, [matchStage]);
  if (eventEmitter.listenerCount("teleop-animation") === 0) {
    eventEmitter.on("teleop-animation", () => {
      console.log("teleop-animation", matchStageRef.current);

      if (matchStageRef.current !== "auto") {
        console.log("not auto");
        console.log(matchStageRef.current);
        clearTeleopAnimations();
        if (recurringTeleopAnimation.current) {
          clearInterval(recurringTeleopAnimation.current);
          recurringTeleopAnimation.current = null;
        }
        return;
      }
      if (teleopAnimationRunning) {
        console.log("teleopAnimationRunning");
        return;
      }
      setTeleopAnimationRunning(true);
      console.log("===========================================");

      setTeleopAnimationBackdrop(true);
      if (!teleopAnimationBackdropTimeout.current) {
        teleopAnimationBackdropTimeout.current = setTimeout(() => {
          setTeleopAnimationBackdrop(false);
          clearTeleopAnimations();
        }, TELEOP_TAB_FLASH_MS * 6);
      }

      setTeleopTabAnimation(true);
      if (!teleopTabAnimation1.current) {
        teleopTabAnimation1.current = setTimeout(() => {
          console.log("teleop-tab-animation-1");
          setTeleopTabAnimation(false);
        }, TELEOP_TAB_FLASH_MS);
      }
      if (!teleopTabAnimation2.current) {
        teleopTabAnimation2.current = setTimeout(() => {
          console.log("teleop-tab-animation-2");
          setTeleopTabAnimation(true);
        }, TELEOP_TAB_FLASH_MS * 2);
      }
      if (!teleopTabAnimation3.current) {
        teleopTabAnimation3.current = setTimeout(() => {
          console.log("teleop-tab-animation-3");
          setTeleopTabAnimation(false);
        }, TELEOP_TAB_FLASH_MS * 3);
      }
      if (!teleopTabAnimation4.current) {
        teleopTabAnimation4.current = setTimeout(() => {
          console.log("teleop-tab-animation-4");
          setTeleopTabAnimation(true);
        }, TELEOP_TAB_FLASH_MS * 4);
      }
      if (!teleopTabAnimation5.current) {
        teleopTabAnimation5.current = setTimeout(() => {
          console.log("teleop-tab-animation-5");
          setTeleopTabAnimation(false);
          clearTeleopAnimations();
        }, TELEOP_TAB_FLASH_MS * 5);
      }

      if (!recurringTeleopAnimation.current) {
        console.log("ooooooooooooooooooooooooooooooooooooooooooooooooooo");
        recurringTeleopAnimation.current = setInterval(() => {
          console.log("||||||||||||||||||||||||||||||||||||||||||||||||||");
          eventEmitter.emit("teleop-animation");
        }, TELEOP_TAB_FLASH_MS + 10000);
      }
    });
  }
  console.log("++++", recurringTeleopAnimation.current);

  const noShowTeamMatchEntry = (m: TeamMatchEntry): TeamMatchEntry => {
    return {
      ...TeamMatchEntryNoShowInit,
      eventKey: m.eventKey,
      matchLevel: m.matchLevel,
      matchNumber: m.matchNumber,
      teamNumber: m.teamNumber!,
      alliance: m.alliance,
      robotNumber: m.robotNumber as 1 | 2,
      deviceTeamNumber: m.deviceTeamNumber,
      deviceId: m.deviceId,
      scoutTeamNumber: m.scoutTeamNumber,
      scoutName: m.scoutName,
      flag: m.flag,
    };
  };

  return (
    <ScoutPageContainer
      backdrop={teleopAnimationBackdrop}
      onCloseBackdrop={() => {
        clearTeleopAnimations();
      }}
      title={
        <Box
          sx={{
            flex: 1,
            borderBottom: 1,
            borderColor: "divider",
            overflowX: "scroll",
          }}>
          <Tabs
            value={matchStage}
            onChange={(_event, value) => {
              clearTeleopAnimations();
              if (recurringTeleopAnimation.current) {
                clearInterval(recurringTeleopAnimation.current);
                recurringTeleopAnimation.current = null;
              }

              if (matchStage === "prematch") {
                if (!prematchCheck()) {
                  setMatchStage(value);
                }
              } else {
                setMatchStage(value);
              }
            }}
            scrollButtons="auto"
            allowScrollButtonsMobile>
            <Tab
              label="Pre"
              value="prematch"
              sx={{
                minHeight: 32, // Reduce height of individual Tab
                padding: "4px 8px", // Optional: reduce padding
              }}
            />
            <Tab
              label="Auto"
              value="auto"
              sx={{
                minHeight: 32, // Reduce height of individual Tab
                padding: "4px 8px", // Optional: reduce padding
              }}
              disabled={match.noShow}
            />
            <Tab
              label="Teleop"
              value="teleop"
              disabled={match.noShow}
              sx={{
                ...(teleopTabAnimation && {
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                }),
                transition: "all " + TELEOP_TAB_FLASH_MS + "ms",
              }}
            />
            <Tab
              label="Post"
              value="postmatch"
              disabled={match.noShow}
            />
          </Tabs>
        </Box>
      }
      nowScouting={{
        teamNumber: match.teamNumber || 0,
        alliance: match.alliance,
        robotPosition: match.robotNumber,
      }}
      navButtons={
        matchStage === "prematch" ?
          <>
            <Button
              variant="outlined"
              onClick={() => {
                navigate("/");
              }}
              sx={{
                mr: "auto",
              }}>
              Exit
            </Button>
            <Button
              onClick={() => {
                prematchCheck();
                if (!prematchCheck()) {
                  setMatchStage("auto");
                }
              }}
              color="secondary"
              variant="contained">
              Auto
            </Button>
            {(match as TeamMatchEntry).noShow && (
              <Button
                variant="contained"
                onClick={() => {
                  if ((match as TeamMatchEntry).noShow) {
                    setMatch(noShowTeamMatchEntry(match as TeamMatchEntry));
                    putEntries.mutate([
                      noShowTeamMatchEntry(match as TeamMatchEntry),
                    ]);
                  } else {
                    putEntries.mutate([match]);
                  }
                }}
                color="secondary">
                Submit
              </Button>
            )}
          </>
        : matchStage === "auto" ?
          <>
            <Button
              onClick={() => {
                prematchCheck();
                if (!prematchCheck()) {
                  setMatchStage("teleop");
                }
              }}
              color="secondary"
              variant="contained">
              TELEOP
            </Button>
            {(match as TeamMatchEntry).noShow && (
              <Button
                variant="contained"
                onClick={() => {
                  if ((match as TeamMatchEntry).noShow) {
                    setMatch(noShowTeamMatchEntry(match as TeamMatchEntry));
                    putEntries.mutate([
                      noShowTeamMatchEntry(match as TeamMatchEntry),
                    ]);
                  } else {
                    putEntries.mutate([match]);
                  }
                }}>
                Submit
              </Button>
            )}
          </>
        : matchStage === "teleop" ?
          <>
            <Button
              onClick={() => {
                prematchCheck();
                if (!prematchCheck()) {
                  setMatchStage("postmatch");
                }
              }}
              color="secondary"
              variant="contained">
              POSTMATCH
            </Button>
            {(match as TeamMatchEntry).noShow && (
              <Button
                variant="contained"
                onClick={() => {
                  if ((match as TeamMatchEntry).noShow) {
                    setMatch(noShowTeamMatchEntry(match as TeamMatchEntry));
                    putEntries.mutate([
                      noShowTeamMatchEntry(match as TeamMatchEntry),
                    ]);
                  } else {
                    putEntries.mutate([match]);
                  }
                }}>
                Submit
              </Button>
            )}
          </>
        : matchStage === "postmatch" ?
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if ((match as TeamMatchEntry).noShow) {
                setMatch(noShowTeamMatchEntry(match));
                putEntries.mutate([noShowTeamMatchEntry(match)]);
              } else {
                putEntries.mutate([match]);
              }
            }}>
            Submit
          </Button>
        : undefined
      }>
      <Stack
        sx={{
          width: 1,
          height: 1,
        }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "scroll",
          }}>
          {
            {
              prematch: (
                <Prematch
                  match={match as TeamMatchEntry}
                  setMatch={setMatch}
                  events={events}
                  deviceSetup={deviceSetup}
                  matchNumberError={matchNumberError}
                  scoutNameError={scoutNameError}
                  scoutTeamNumberError={scoutTeamNumberError}
                  teamNumberError={teamNumberError}
                />
              ),
              auto: (
                <Auto
                  match={match as TeamMatchEntry}
                  setMatch={setMatch}
                  eventEmitter={eventEmitter}
                />
              ),
              teleop: (
                <Teleop
                  match={match as TeamMatchEntry}
                  setMatch={setMatch}
                />
              ),
              postmatch: (
                <Postmatch
                  match={match as TeamMatchEntry}
                  setMatch={setMatch}
                />
              ),
            }[matchStage]
          }
        </Box>
      </Stack>
    </ScoutPageContainer>
  );
}
