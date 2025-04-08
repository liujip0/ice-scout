import {
  DBEvent,
  HumanPlayerEntry,
  Match,
  MatchLevel,
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
import { StyledToggleButton } from "../components/StyledToggleButton.tsx";
import { BigCounter } from "./Components.tsx";

type HumanProps = {
  match: HumanPlayerEntry;
  setMatch: (value: HumanPlayerEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
  scoutNameError: string;
  scoutTeamNumberError: string;
  teamNumberError: string;
};
export default function Human({
  match,
  setMatch,
  events,
  scoutNameError,
  scoutTeamNumberError,
  teamNumberError,
}: HumanProps) {
  const eventMatches = events.find(
    (event) => event.eventKey === match.eventKey
  )?.matches;

  return (
    <Stack
      direction="row"
      sx={{
        width: 1,
        height: 1,
        pt: 2,
      }}>
      <Stack
        sx={{
          flex: 1,
          pl: 2,
          pr: 2,
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
            <MenuItem value="None">n</MenuItem>
            <MenuItem value="Practice">p</MenuItem>
            <MenuItem value="Qualification">q</MenuItem>
            <MenuItem value="Playoff">t</MenuItem>
          </TextField>
          <TextField
            value={isNaN(match.matchNumber) ? "" : match.matchNumber}
            onChange={(event) => {
              setMatch({
                ...match,
                matchNumber: parseInt(event.currentTarget.value),
                teamNumber: 0,
              });
            }}
            label="Match Number"
            slotProps={{
              input: {
                startAdornment: (
                  <IconButton
                    onClick={() => {
                      if (match.matchNumber > 1) {
                        setMatch({
                          ...match,
                          matchNumber: match.matchNumber - 1,
                          teamNumber: 0,
                        });
                      }
                    }}>
                    <Remove />
                  </IconButton>
                ),
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setMatch({
                        ...match,
                        matchNumber: match.matchNumber + 1,
                        teamNumber: 0,
                      });
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
            <FormLabel>Human Player Team Number</FormLabel>
            <ToggleButtonGroup
              sx={{
                width: 1,
                borderWidth: teamNumberError !== "" ? 2 : 0,
                borderColor: "error.main",
                borderStyle: "solid",
              }}
              value={match.teamNumber}
              exclusive
              onChange={(_event, value) => {
                if (value) {
                  setMatch({
                    ...match,
                    teamNumber: value,
                  });
                }
              }}>
              <StyledToggleButton
                sx={{
                  flex: 1,
                }}
                value={
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "1") as "red1" | "blue1"]
                }>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "1") as "red1" | "blue1"]
                }
              </StyledToggleButton>
              <StyledToggleButton
                sx={{
                  flex: 1,
                }}
                value={
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "2") as "red2" | "blue2"]
                }>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "2") as "red2" | "blue2"]
                }
              </StyledToggleButton>
              <StyledToggleButton
                sx={{
                  flex: 1,
                }}
                value={
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "3") as "red3" | "blue3"]
                }>
                {
                  eventMatches.find(
                    (x) =>
                      x.matchNumber === match.matchNumber &&
                      x.matchLevel === match.matchLevel
                  )![(match.alliance.toLowerCase() + "3") as "red3" | "blue3"]
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
            label="Human Player Team Number"
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
      </Stack>
      <Divider
        orientation="vertical"
        variant="middle"
        flexItem
      />
      <Stack
        sx={{
          flex: 1,
          pl: 4,
          pr: 4,
        }}
        gap={2}>
        <BigCounter
          value={match.humanAttemptedNet!}
          increment={() => {
            setMatch({
              ...match,
              humanAttemptedNet: match.humanAttemptedNet! + 1,
            });
          }}
          decrement={() => {
            setMatch({
              ...match,
              humanAttemptedNet: match.humanAttemptedNet! - 1,
            });
          }}
          label="Attempted Algae in Net"
          max={18}
          disabled={!match.teamNumber}
        />
        <BigCounter
          value={match.humanSuccessfulNet!}
          increment={() => {
            if (match.humanAttemptedNet! < 18) {
              setMatch({
                ...match,
                humanSuccessfulNet: match.humanSuccessfulNet! + 1,
                humanAttemptedNet: match.humanAttemptedNet! + 1,
              });
            } else {
              setMatch({
                ...match,
                humanSuccessfulNet: match.humanSuccessfulNet! + 1,
              });
            }
          }}
          decrement={() => {
            setMatch({
              ...match,
              humanSuccessfulNet: match.humanSuccessfulNet! - 1,
            });
          }}
          label="Successful Algae in Net"
          max={18}
          disabled={!match.teamNumber}
        />
        {
          //TODO: if adding comments for human players: .replace(/"/g, "'")
        }
      </Stack>
    </Stack>
  );
}
