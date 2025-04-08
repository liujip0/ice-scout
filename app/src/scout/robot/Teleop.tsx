import { TeamMatchEntry } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Box, Divider, Stack, ToggleButtonGroup } from "@mui/material";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import { Counter } from "../Components.tsx";

type TeleopProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
};
export function Teleop({ match, setMatch }: TeleopProps) {
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
          flex: 2,
          padding: 2,
        }}>
        <Stack
          sx={{
            width: "40%",
            height: 1,
            alignItems: "center",
          }}>
          <Box
            sx={{
              height: "100%",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "1015 / 3069",
                maxHeight: "100%",
                maxWidth: "100%",
                position: "relative",
              }}>
              <img
                src={"/Branch.png"}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  width: "100%",
                  height: "30%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL4! < 12) {
                    setMatch({
                      ...match,
                      teleopL4: match.teleopL4! + 1,
                    });
                  }
                }}
              />
              <Counter
                value={match.teleopL4!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopL4: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "70%",
                }}
              />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "30%",
                  left: "0%",
                  width: "100%",
                  height: "20%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL3! < 12) {
                    setMatch({
                      ...match,
                      teleopL3: match.teleopL3! + 1,
                    });
                  }
                }}
              />
              <Counter
                value={match.teleopL3!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopL3: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "50%",
                }}
              />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "50%",
                  left: "0%",
                  width: "100%",
                  height: "20%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL2! < 12) {
                    setMatch({
                      ...match,
                      teleopL2: match.teleopL2! + 1,
                    });
                  }
                }}
              />
              <Counter
                value={match.teleopL2!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopL2: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "30%",
                }}
              />
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  top: "70%",
                  left: "0%",
                  width: "100%",
                  height: "30%",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "primary.main",
                  backgroundColor: theme.palette.primary.main + "20",
                })}
                onClick={() => {
                  if (match.teleopL1! < 12) {
                    setMatch({
                      ...match,
                      teleopL1: match.teleopL1! + 1,
                    });
                  }
                }}
              />
              <Counter
                value={match.teleopL1!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopL1: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "0%",
                }}
              />
            </Box>
          </Box>
        </Stack>
        <Stack
          sx={{
            height: 1,
            width: "60%",
            alignItems: "center",
            padding: 1,
          }}>
          <Box
            sx={{
              aspectRatio: "1670 / 2881",
              height: "65%",
              position: "relative",
              padding: 1,
            }}
            onClick={() => {
              if (match.teleopNet! < 18) {
                setMatch({
                  ...match,
                  teleopNet: match.teleopNet! + 1,
                });
              }
            }}>
            <img
              src={"/Net.png"}
              style={{
                height: "100%",
                width: "100%",
              }}
            />
            <Counter
              value={match.teleopNet!}
              setValue={(value) => {
                setMatch({
                  ...match,
                  teleopNet: value,
                });
              }}
              sx={{
                position: "absolute",
                left: "0%",
                bottom: "0%",
              }}
            />
          </Box>
          <Box
            sx={{
              height: "35%",
              padding: 1,
            }}>
            <Box
              sx={{
                aspectRatio: "2547 / 2311",
                maxHeight: "100%",
                maxWidth: "100%",
                position: "relative",
              }}
              onClick={() => {
                if (match.teleopProcessor! < 18) {
                  setMatch({
                    ...match,
                    teleopProcessor: match.teleopProcessor! + 1,
                  });
                }
              }}>
              <img
                src={"/Processor.png"}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
              <Counter
                value={match.teleopProcessor!}
                setValue={(value) => {
                  setMatch({
                    ...match,
                    teleopProcessor: value,
                  });
                }}
                sx={{
                  position: "absolute",
                  left: "0%",
                  bottom: "0%",
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
      <Divider
        orientation="vertical"
        flexItem
      />
      <Stack
        sx={{
          flex: 2,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <StyledRedToggleButton
          value="Robot Died?"
          selected={match.died!}
          onChange={() =>
            setMatch({
              ...match,
              died: !match.died,
            })
          }>
          Robot Died
        </StyledRedToggleButton>
        <StyledToggleButton
          value="Removed Algae from Reef?"
          selected={match.removedAlgaeFromReef!}
          onChange={() =>
            setMatch({
              ...match,
              removedAlgaeFromReef: !match.removedAlgaeFromReef,
            })
          }>
          Removed Algae from Reef
        </StyledToggleButton>
        <StyledToggleButton
          value="Played Defense?"
          selected={match.playedDefense!}
          onChange={() =>
            setMatch({
              ...match,
              playedDefense: !match.playedDefense,
            })
          }>
          Played Defense
        </StyledToggleButton>
        <Stack
          sx={{
            width: 1,
          }}>
          <ToggleButtonGroup
            sx={{
              width: 1,
            }}>
            <StyledToggleButton
              value="Attempted Shallow Climb?"
              selected={match.teleopAttemptedShallow!}
              onChange={() => {
                if (!match.teleopAttemptedShallow) {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: true,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedShallow: false,
                    teleopSuccessfulShallow: false,
                  });
                }
              }}
              sx={{
                borderBottomLeftRadius: 0,
                borderBottomWidth: 0,
                width: 0.5,
              }}>
              Attempted Shallow Climb
            </StyledToggleButton>
            <StyledToggleButton
              value="Attempted Deep Climb?"
              selected={match.teleopAttemptedDeep!}
              onChange={() => {
                if (!match.teleopAttemptedDeep) {
                  setMatch({
                    ...match,
                    teleopAttemptedDeep: true,
                    teleopAttemptedShallow: false,
                    teleopSuccessfulShallow: false,
                    teleopSuccessfulDeep: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulDeep: false,
                  });
                }
              }}
              sx={{
                borderBottomRightRadius: 0,
                borderBottomWidth: 0,
                width: 0.5,
              }}>
              Attempted Deep Climb
            </StyledToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            sx={{
              width: 1,
            }}>
            <StyledToggleButton
              value="Successful Shallow Climb?"
              selected={match.teleopSuccessfulShallow!}
              onChange={() => {
                if (!match.teleopSuccessfulShallow) {
                  setMatch({
                    ...match,
                    teleopSuccessfulShallow: true,
                    teleopAttemptedShallow: true,
                    teleopAttemptedDeep: false,
                    teleopSuccessfulDeep: false,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulShallow: false,
                  });
                }
              }}
              sx={{
                borderTopLeftRadius: 0,
                width: 0.5,
              }}>
              Successful Shallow Climb
            </StyledToggleButton>
            <StyledToggleButton
              value="Successful Deep Climb?"
              selected={match.teleopSuccessfulDeep!}
              onChange={() => {
                if (!match.teleopSuccessfulDeep) {
                  setMatch({
                    ...match,
                    teleopSuccessfulDeep: true,
                    teleopAttemptedShallow: false,
                    teleopAttemptedDeep: true,
                    teleopSuccessfulShallow: false,
                    teleopPark: false,
                  });
                } else {
                  setMatch({
                    ...match,
                    teleopSuccessfulDeep: false,
                  });
                }
              }}
              sx={{
                borderTopRightRadius: 0,
                width: 0.5,
              }}>
              Successful Deep Climb
            </StyledToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <StyledToggleButton
          value="Parked?"
          selected={match.teleopPark!}
          onChange={() => {
            if (!match.teleopPark) {
              setMatch({
                ...match,
                teleopPark: !match.teleopPark,
                teleopSuccessfulShallow: false,
                teleopSuccessfulDeep: false,
              });
            } else {
              setMatch({
                ...match,
                teleopPark: !match.teleopPark,
              });
            }
          }}>
          Parked
        </StyledToggleButton>
      </Stack>
    </Stack>
  );
}
