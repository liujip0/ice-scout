import {
  TeamMatchEntry,
  TeamMatchEntryColumn,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  Box,
  ButtonGroup,
  ClickAwayListener,
  Divider,
  Popper,
  Stack,
} from "@mui/material";
import EventEmitter from "events";
import { useEffect, useRef, useState } from "react";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";
import { AutoL1Counter, AutoReefButton, Counter } from "../Components.tsx";

type AutoProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  deviceSetup: DeviceSetupObj;
  eventEmitter: EventEmitter;
};
export default function Auto({
  match,
  setMatch,
  deviceSetup,
  eventEmitter,
}: AutoProps) {
  const [popperReef, setPopperReef] = useState<
    "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | ""
  >("");

  const toggleButtonRefs = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (toggleButtonRefs.every((ref) => ref.current !== null)) {
      setHeight(
        toggleButtonRefs.reduce(
          (acc, ref) => acc + ref.current!.getBoundingClientRect().height,
          0
        ) + 48
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const teleopTimeoutHasRun = useRef(false);
  const teleopTimeout = useRef<NodeJS.Timeout | null>(null);
  console.log("---", teleopTimeout.current);
  useEffect(() => {
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("-------------------------------------");
        eventEmitter.emit("teleop-animation");
      }
    }, 30000);
    return () => {
      if (teleopTimeout.current) {
        clearTimeout(teleopTimeout.current);
      }
    };
  }, [eventEmitter]);
  const [teleopTimeoutButtonClicked, setTeleopTimeoutButtonClicked] =
    useState(false);
  const teleopTimeoutButtonClick = () => {
    if (teleopTimeoutButtonClicked) {
      return;
    }

    console.log("teleopTimeoutButtonClick");
    setTeleopTimeoutButtonClicked(true);
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
    teleopTimeout.current = setTimeout(() => {
      if (!teleopTimeoutHasRun.current) {
        teleopTimeoutHasRun.current = true;
        console.log("_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
        eventEmitter.emit("teleop-animation");
      }
    }, 15000);
  };
  eventEmitter.on("teleop-animation", () => {
    if (teleopTimeout.current) {
      clearTimeout(teleopTimeout.current);
      teleopTimeout.current = null;
    }
  });

  return (
    <Stack
      direction="row"
      sx={{
        width: 1,
        height: 1,
      }}>
      <Stack
        direction="row"
        sx={{
          width: "50%",
          padding: 2,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Box
          sx={{
            aspectRatio: "2547 / 2869",
            maxHeight: "100%",
            maxWidth: "100%",
            position: "relative",
          }}>
          <img
            src={"/Reef.png"}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
          <AutoReefButton
            selected={popperReef === "A"}
            coralStates={{
              L4: match.autoCoralAL4!,
              L3: match.autoCoralAL3!,
              L2: match.autoCoralAL2!,
              L1: match.autoCoralABL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "A" ? "" : "A");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "A" Location
                  position: "absolute",
                  left: "8%",
                  top: "40%",
                  transform: "translate(-50%, -50%)",
                }
              : {
                  //Processor-Side "G" Location
                  position: "absolute",
                  right: "8%",
                  bottom: "40%",
                  transform: "translate(50%, 50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "B"}
            coralStates={{
              L4: match.autoCoralBL4!,
              L3: match.autoCoralBL3!,
              L2: match.autoCoralBL2!,
              L1: match.autoCoralABL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "B" ? "" : "B");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "B" Location
                  position: "absolute",
                  left: "8%",
                  bottom: "40%",
                  transform: "translate(-50%, 50%)",
                }
              : {
                  //Processor-Side "H" Location
                  position: "absolute",
                  right: "8%",
                  top: "40%",
                  transform: "translate(50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "C"}
            coralStates={{
              L4: match.autoCoralCL4!,
              L3: match.autoCoralCL3!,
              L2: match.autoCoralCL2!,
              L1: match.autoCoralCDL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "C" ? "" : "C");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "C" Location
                  position: "absolute",
                  left: "18%",
                  bottom: "20%",
                  transform: "translate(-50%, 50%)",
                }
              : {
                  //Processor-Side "I" Location
                  position: "absolute",
                  right: "18%",
                  top: "20%",
                  transform: "translate(50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "D"}
            coralStates={{
              L4: match.autoCoralDL4!,
              L3: match.autoCoralDL3!,
              L2: match.autoCoralDL2!,
              L1: match.autoCoralCDL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "D" ? "" : "D");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "D" Location
                  position: "absolute",
                  left: "38%",
                  bottom: "12%",
                  transform: "translate(-50%, 50%)",
                }
              : {
                  //Processor-Side "J" Location
                  position: "absolute",
                  right: "38%",
                  top: "12%",
                  transform: "translate(50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "E"}
            coralStates={{
              L4: match.autoCoralEL4!,
              L3: match.autoCoralEL3!,
              L2: match.autoCoralEL2!,
              L1: match.autoCoralEFL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "E" ? "" : "E");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "E" Location
                  position: "absolute",
                  right: "38%",
                  bottom: "12%",
                  transform: "translate(50%, 50%)",
                }
              : {
                  //Processor-Side "K" Location
                  position: "absolute",
                  left: "38%",
                  top: "12%",
                  transform: "translate(-50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "F"}
            coralStates={{
              L4: match.autoCoralFL4!,
              L3: match.autoCoralFL3!,
              L2: match.autoCoralFL2!,
              L1: match.autoCoralEFL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "F" ? "" : "F");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "F" Location
                  position: "absolute",
                  right: "18%",
                  bottom: "20%",
                  transform: "translate(50%, 50%)",
                }
              : {
                  //Processor-Side "L" Location
                  position: "absolute",
                  left: "18%",
                  top: "20%",
                  transform: "translate(-50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "G"}
            coralStates={{
              L4: match.autoCoralGL4!,
              L3: match.autoCoralGL3!,
              L2: match.autoCoralGL2!,
              L1: match.autoCoralGHL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "G" ? "" : "G");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "G" Location
                  position: "absolute",
                  right: "8%",
                  bottom: "40%",
                  transform: "translate(50%, 50%)",
                }
              : {
                  //Processor-Side "A" Location
                  position: "absolute",
                  left: "8%",
                  top: "40%",
                  transform: "translate(-50%, -50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "H"}
            coralStates={{
              L4: match.autoCoralHL4!,
              L3: match.autoCoralHL3!,
              L2: match.autoCoralHL2!,
              L1: match.autoCoralGHL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "H" ? "" : "H");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "H" Location
                  position: "absolute",
                  right: "8%",
                  top: "40%",
                  transform: "translate(50%, -50%)",
                }
              : {
                  //Processor-Side "B" Location
                  position: "absolute",
                  left: "8%",
                  bottom: "40%",
                  transform: "translate(-50%, 50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "I"}
            coralStates={{
              L4: match.autoCoralIL4!,
              L3: match.autoCoralIL3!,
              L2: match.autoCoralIL2!,
              L1: match.autoCoralIJL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "I" ? "" : "I");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "I" Location
                  position: "absolute",
                  right: "18%",
                  top: "20%",
                  transform: "translate(50%, -50%)",
                }
              : {
                  //Processor-Side "C" Location
                  position: "absolute",
                  left: "18%",
                  bottom: "20%",
                  transform: "translate(-50%, 50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "J"}
            coralStates={{
              L4: match.autoCoralJL4!,
              L3: match.autoCoralJL3!,
              L2: match.autoCoralJL2!,
              L1: match.autoCoralIJL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "J" ? "" : "J");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "J" Location
                  position: "absolute",
                  right: "38%",
                  top: "12%",
                  transform: "translate(50%, -50%)",
                }
              : {
                  //Processor-Side "D" Location
                  position: "absolute",
                  left: "38%",
                  bottom: "12%",
                  transform: "translate(-50%, 50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "K"}
            coralStates={{
              L4: match.autoCoralKL4!,
              L3: match.autoCoralKL3!,
              L2: match.autoCoralKL2!,
              L1: match.autoCoralKLL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "K" ? "" : "K");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "K" Location
                  position: "absolute",
                  left: "38%",
                  top: "12%",
                  transform: "translate(-50%, -50%)",
                }
              : {
                  //Processor-Side "E" Location
                  position: "absolute",
                  right: "38%",
                  bottom: "12%",
                  transform: "translate(50%, 50%)",
                }
            }
          />
          <AutoReefButton
            selected={popperReef === "L"}
            coralStates={{
              L4: match.autoCoralLL4!,
              L3: match.autoCoralLL3!,
              L2: match.autoCoralLL2!,
              L1: match.autoCoralKLL1!,
            }}
            onClick={(event) => {
              event.stopPropagation();
              teleopTimeoutButtonClick();
              setPopperReef(popperReef === "L" ? "" : "L");
            }}
            sx={
              deviceSetup.fieldOrientation === "processor" ?
                {
                  //Processor-Side "L" Location
                  position: "absolute",
                  left: "18%",
                  top: "20%",
                  transform: "translate(-50%, -50%)",
                }
              : {
                  //Processor-Side "F" Location
                  position: "absolute",
                  right: "18%",
                  bottom: "20%",
                  transform: "translate(50%, 50%)",
                }
            }
          />
          <ClickAwayListener
            onClickAway={() => {
              setPopperReef("");
            }}>
            <Popper
              open={popperReef !== ""}
              slotProps={{
                root: {
                  style: {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  },
                },
              }}
              disablePortal
              modifiers={[
                {
                  name: "flip",
                  enabled: true,
                  options: {
                    altBoundary: true,
                    rootBoundary: "viewport",
                    padding: 8,
                  },
                },
                {
                  name: "preventOverflow",
                  enabled: true,
                  options: {
                    altAxis: true,
                    altBoundary: true,
                    tether: true,
                    rootBoundary: "document",
                    padding: 8,
                  },
                },
              ]}>
              <ButtonGroup
                orientation="vertical"
                sx={{
                  backgroundColor: "background.paper",
                }}>
                <StyledToggleButton
                  value="L4"
                  selected={
                    match[
                      ("autoCoral" + popperReef + "L4") as TeamMatchEntryColumn
                    ] as boolean
                  }
                  onClick={() => {
                    if (popperReef) {
                      setMatch({
                        ...match,
                        ["autoCoral" + popperReef + "L4"]: !(match[
                          ("autoCoral" +
                            popperReef +
                            "L4") as TeamMatchEntryColumn
                        ] as boolean),
                      });
                      setPopperReef("");
                    }
                  }}>
                  L4
                </StyledToggleButton>
                <StyledToggleButton
                  value="L3"
                  selected={
                    match[
                      ("autoCoral" + popperReef + "L3") as TeamMatchEntryColumn
                    ] as boolean
                  }
                  onClick={() => {
                    if (popperReef) {
                      setMatch({
                        ...match,
                        ["autoCoral" + popperReef + "L3"]: !(match[
                          ("autoCoral" +
                            popperReef +
                            "L3") as TeamMatchEntryColumn
                        ] as boolean),
                      });
                      setPopperReef("");
                    }
                  }}>
                  L3
                </StyledToggleButton>
                <StyledToggleButton
                  value="L2"
                  selected={
                    match[
                      ("autoCoral" + popperReef + "L2") as TeamMatchEntryColumn
                    ] as boolean
                  }
                  onClick={() => {
                    if (popperReef) {
                      setMatch({
                        ...match,
                        ["autoCoral" + popperReef + "L2"]: !(match[
                          ("autoCoral" +
                            popperReef +
                            "L2") as TeamMatchEntryColumn
                        ] as boolean),
                      });
                      setPopperReef("");
                    }
                  }}>
                  L2
                </StyledToggleButton>
                <AutoL1Counter
                  value={
                    popperReef !== "" ?
                      (match[
                        ("autoCoral" +
                          {
                            A: "AB",
                            B: "AB",
                            C: "CD",
                            D: "CD",
                            E: "EF",
                            F: "EF",
                            G: "GH",
                            H: "GH",
                            I: "IJ",
                            J: "IJ",
                            K: "KL",
                            L: "KL",
                          }[popperReef] +
                          "L1") as TeamMatchEntryColumn
                      ] as number)
                    : 0
                  }
                  setValue={(value) => {
                    if (popperReef) {
                      setMatch({
                        ...match,
                        ["autoCoral" +
                        {
                          A: "AB",
                          B: "AB",
                          C: "CD",
                          D: "CD",
                          E: "EF",
                          F: "EF",
                          G: "GH",
                          H: "GH",
                          I: "IJ",
                          J: "IJ",
                          K: "KL",
                          L: "KL",
                        }[popperReef] +
                        "L1"]: value,
                      });
                      setPopperReef("");
                    }
                  }}
                  max={6}
                />
              </ButtonGroup>
            </Popper>
          </ClickAwayListener>
        </Box>
      </Stack>
      <Divider orientation="vertical" />
      <Stack
        sx={{
          width: "50%",
          height: "100%",
          padding: 2,
        }}
        gap={2}>
        <StyledRedToggleButton
          value="Robot Died?"
          selected={match.died!}
          onChange={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              died: !match.died,
            });
          }}
          ref={toggleButtonRefs[0]}>
          Robot Died
        </StyledRedToggleButton>
        <StyledToggleButton
          value="Removed Algae from Reef?"
          selected={match.removedAlgaeFromReef!}
          onChange={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              removedAlgaeFromReef: !match.removedAlgaeFromReef,
            });
          }}
          ref={toggleButtonRefs[1]}>
          Removed Algae from Reef
        </StyledToggleButton>
        <StyledToggleButton
          value="Crossed Robot Starting Line?"
          selected={match.autoCrossedRSL!}
          onChange={() => {
            teleopTimeoutButtonClick();
            setMatch({
              ...match,
              autoCrossedRSL: !match.autoCrossedRSL,
            });
          }}
          ref={toggleButtonRefs[2]}>
          Crossed Robot Starting Line
        </StyledToggleButton>
        <Stack
          direction="row"
          sx={{
            flex: 1,
            height: `calc(100% - ${height}px)`,
          }}>
          <Stack
            sx={{
              width: "65%",
              alignItems: "center",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "2547 / 2311",
                maxWidth: "100%",
                maxHeight: "100%",
                position: "relative",
              }}
              onClick={() => {
                teleopTimeoutButtonClick();
                if (match.autoProcessor! < 10) {
                  setMatch({
                    ...match,
                    autoProcessor: match.autoProcessor! + 1,
                  });
                }
              }}>
              <img
                src={"/Processor.png"}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Counter
                value={match.autoProcessor!}
                setValue={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoProcessor: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "0%",
                }}
              />
            </Box>
          </Stack>
          <Stack
            sx={{
              width: "35%",
              alignItems: "center",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "1670 / 2881",
                maxWidth: "100%",
                maxHeight: "100%",
                position: "relative",
              }}
              onClick={() => {
                teleopTimeoutButtonClick();
                if (match.autoNet! < 10) {
                  setMatch({
                    ...match,
                    autoNet: match.autoNet! + 1,
                  });
                }
              }}>
              <img
                src={"/Net.png"}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
              <Counter
                value={match.autoNet!}
                setValue={(value) => {
                  teleopTimeoutButtonClick();
                  setMatch({
                    ...match,
                    autoNet: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "0%",
                }}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
