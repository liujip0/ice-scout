import {
  DBEvent,
  Match,
  MatchLevel,
  TeamMatchEntry,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { Add, Remove } from "@mui/icons-material";
import {
  Divider,
  FormHelperText,
  FormLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButtonGroup,
} from "@mui/material";
import {
  StyledRedToggleButton,
  StyledToggleButton,
} from "../../components/StyledToggleButton.tsx";
import { DeviceSetupObj } from "../../setup/DeviceSetup.tsx";

type PrematchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  deviceSetup: DeviceSetupObj;
  matchNumberError: string;
  scoutNameError: string;
  scoutTeamNumberError: string;
  teamNumberError: string;
};
export default function Prematch({
  match,
  setMatch,
  events,
  deviceSetup,
  matchNumberError,
  scoutNameError,
  scoutTeamNumberError,
  teamNumberError,
}: PrematchProps) {
  const eventMatches = events.find(
    (event) => event.eventKey === match.eventKey
  )?.matches;

  return (
    <Stack
      direction="row"
      sx={{
        width: 1,
        height: 1,
      }}>
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <TextField
          value={match.scoutName}
          onChange={(event) => {
            setMatch({
              ...match,
              scoutName: event.currentTarget.value,
            });
          }}
          type="text"
          variant="outlined"
          label="Scout Name & Last Initial"
          error={scoutNameError !== ""}
          helperText={scoutNameError}
        />
        <TextField
          value={isNaN(match.scoutTeamNumber) ? "" : match.scoutTeamNumber}
          onChange={(event) => {
            setMatch({
              ...match,
              scoutTeamNumber: parseInt(event.currentTarget.value),
            });
          }}
          variant="outlined"
          label="Scout Team Number"
          error={scoutTeamNumberError !== ""}
          helperText={scoutTeamNumberError}
        />
      </Stack>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
      />
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={2}>
        <Stack
          direction="row"
          gap={1}
          sx={{
            width: 1,
          }}>
          <TextField
            select
            value={match.matchLevel}
            label="Level"
            onChange={(event) => {
              setMatch({
                ...match,
                matchLevel: event.target.value as (typeof MatchLevel)[number],
              });
            }}
            sx={{
              width: "5em",
            }}>
            <MenuItem value="QUALIFICATION">q</MenuItem>
            <MenuItem value="PLAYOFF">t</MenuItem>
          </TextField>
          <TextField
            value={isNaN(match.matchNumber) ? "" : match.matchNumber}
            onChange={(event) => {
              const eventMatches = events.find(
                (event) => event.eventKey === match.eventKey
              )?.matches;
              if (
                eventMatches?.some(
                  (x) =>
                    x.matchNumber === parseInt(event.currentTarget.value) &&
                    x.matchLevel === match.matchLevel
                )
              ) {
                setMatch({
                  ...match,
                  matchNumber: parseInt(event.currentTarget.value),
                  teamNumber: eventMatches.find(
                    (x) =>
                      x.matchNumber === parseInt(event.currentTarget.value) &&
                      x.matchLevel === match.matchLevel
                  )![
                    (deviceSetup.alliance.toLowerCase() +
                      deviceSetup.robotNumber) as
                      | "red1"
                      | "red2"
                      | "blue1"
                      | "blue2"
                  ],
                });
              } else {
                setMatch({
                  ...match,
                  matchNumber: parseInt(event.currentTarget.value),
                  teamNumber: 0,
                });
              }
            }}
            error={matchNumberError !== ""}
            helperText={matchNumberError}
            label="Match Number"
            slotProps={{
              input: {
                startAdornment: (
                  <IconButton
                    onClick={() => {
                      if (match.matchNumber > 1) {
                        const eventMatches = events.find(
                          (event) => event.eventKey === deviceSetup.currentEvent
                        )?.matches;
                        if (
                          eventMatches?.some(
                            (x) =>
                              x.matchNumber === match.matchNumber - 1 &&
                              x.matchLevel === match.matchLevel
                          )
                        ) {
                          setMatch({
                            ...match,
                            matchNumber: match.matchNumber - 1,
                            teamNumber: eventMatches.find(
                              (x) =>
                                x.matchNumber === match.matchNumber - 1 &&
                                x.matchLevel === match.matchLevel
                            )![
                              (deviceSetup.alliance.toLowerCase() +
                                deviceSetup.robotNumber) as
                                | "red1"
                                | "red2"
                                | "blue1"
                                | "blue2"
                            ],
                          });
                        } else {
                          setMatch({
                            ...match,
                            matchNumber: match.matchNumber - 1,
                            teamNumber: 0,
                          });
                        }
                      }
                    }}>
                    <Remove />
                  </IconButton>
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      const eventMatches = events.find(
                        (event) => event.eventKey === deviceSetup.currentEvent
                      )?.matches;
                      if (
                        eventMatches?.some(
                          (x) =>
                            x.matchNumber === match.matchNumber + 1 &&
                            x.matchLevel === match.matchLevel
                        )
                      ) {
                        setMatch({
                          ...match,
                          matchNumber: match.matchNumber + 1,
                          teamNumber: eventMatches.find(
                            (x) =>
                              x.matchNumber === match.matchNumber + 1 &&
                              x.matchLevel === match.matchLevel
                          )![
                            (deviceSetup.alliance.toLowerCase() +
                              deviceSetup.robotNumber) as
                              | "red1"
                              | "red2"
                              | "blue1"
                              | "blue2"
                          ],
                        });
                      } else {
                        setMatch({
                          ...match,
                          matchNumber: match.matchNumber + 1,
                          teamNumber: 0,
                        });
                      }
                    }}>
                    <Add />
                  </IconButton>
                ),
              },
            }}
            sx={{
              flex: 1,
            }}
          />
        </Stack>
        {(
          eventMatches?.some(
            (x) =>
              x.matchNumber === match.matchNumber &&
              x.matchLevel === match.matchLevel
          )
        ) ?
          <Stack
            sx={{
              width: 1,
            }}>
            <FormLabel>Robot Team Number</FormLabel>
            <ToggleButtonGroup
              sx={{
                width: 1,
                borderWidth: teamNumberError !== "" ? 2 : 0,
                borderColor: "error.main",
                borderStyle: "solid",
              }}
              exclusive>
              <StyledToggleButton
                value="Red 1"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#ff0000",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#ff0000",
                  borderColor: "#ff0000",
                  backgroundColor: "white",
                }}
                selected={
                  match.teamNumber ===
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["red1"]
                }
                onChange={() => {
                  setMatch({
                    ...match,
                    alliance: "Red",
                    robotNumber: 1,
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchNumber === match.matchNumber &&
                        x.matchLevel === match.matchLevel
                    )!["red1"],
                  });
                }}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["red1"]
                }
              </StyledToggleButton>
              <StyledToggleButton
                value="Red 2"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#ff0000",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#ff0000",
                  borderColor: "#ff0000",
                  backgroundColor: "white",
                }}
                selected={
                  match.teamNumber ===
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["red2"]
                }
                onChange={() => {
                  setMatch({
                    ...match,
                    alliance: "Red",
                    robotNumber: 2,
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchNumber === match.matchNumber &&
                        x.matchLevel === match.matchLevel
                    )!["red2"],
                  });
                }}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["red2"]
                }
              </StyledToggleButton>
              <StyledToggleButton
                value="Blue 1"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#0000ff",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#0000ff",
                  borderColor: "#0000ff",
                  backgroundColor: "white",
                }}
                selected={
                  match.teamNumber ===
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["blue1"]
                }
                onChange={() => {
                  setMatch({
                    ...match,
                    alliance: "Blue",
                    robotNumber: 1,
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchNumber === match.matchNumber &&
                        x.matchLevel === match.matchLevel
                    )!["blue1"],
                  });
                }}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["blue1"]
                }
              </StyledToggleButton>
              <StyledToggleButton
                value="Blue 2"
                sx={{
                  flex: 1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    color: "white",
                    backgroundColor: "#0000ff",
                  },
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                  color: "#0000ff",
                  borderColor: "#0000ff",
                  backgroundColor: "white",
                }}
                selected={
                  match.teamNumber ===
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["blue2"]
                }
                onChange={() => {
                  setMatch({
                    ...match,
                    alliance: "Blue",
                    robotNumber: 2,
                    teamNumber: eventMatches.find(
                      (x) =>
                        x.matchNumber === match.matchNumber &&
                        x.matchLevel === match.matchLevel
                    )!["blue2"],
                  });
                }}>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )!["blue2"]
                }
              </StyledToggleButton>
            </ToggleButtonGroup>
            <TextField
              value={isNaN(match.teamNumber!) ? "" : match.teamNumber}
              onChange={(event) => {
                setMatch({
                  ...match,
                  teamNumber: parseInt(event.currentTarget.value),
                });
              }}
              error={teamNumberError !== ""}
            />
            <FormHelperText
              color="error"
              sx={{
                pl: 2,
                color: teamNumberError ? "error.main" : "text.secondary",
              }}>
              {teamNumberError}
            </FormHelperText>
          </Stack>
        : <TextField
            label="Robot Team Number"
            value={isNaN(match.teamNumber!) ? "" : match.teamNumber}
            onChange={(event) => {
              setMatch({
                ...match,
                teamNumber: parseInt(event.currentTarget.value),
              });
            }}
            error={teamNumberError !== ""}
            helperText={teamNumberError}
          />
        }
        <Divider />
        <StyledRedToggleButton
          value="No Show?"
          selected={match.noShow}
          onChange={() => {
            setMatch({
              ...match,
              noShow: !match.noShow,
            });
          }}>
          No Show
        </StyledRedToggleButton>
      </Stack>
    </Stack>
  );
}
