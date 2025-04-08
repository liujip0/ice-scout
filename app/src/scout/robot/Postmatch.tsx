import { TeamMatchEntry } from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  ToggleButtonGroup,
} from "@mui/material";
import { StyledToggleButton } from "../../components/StyledToggleButton.tsx";

type PostmatchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
  dataConfidenceError: string;
};
export default function Postmatch({
  match,
  setMatch,
  dataConfidenceError,
}: PostmatchProps) {
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
          pl: 4,
        }}>
        <FormControl>
          <FormLabel>
            Did they do any of the following exceptionally well?
          </FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtCoralL1!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtCoralL1: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Coral L1"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtCoralL2!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtCoralL2: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Coral L2"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtCoralL3!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtCoralL3: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Coral L3"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtCoralL4!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtCoralL4: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Coral L4"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtAlgaeNet!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtAlgaeNet: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Algae in Net"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtAlgaeProcessor!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtAlgaeProcessor: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Algae in Processor"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtClimb!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtClimb: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Climb"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtDefense!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtDefense: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Defense"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtWorkingWithAlliance!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtWorkingWithAlliance: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Working with Alliance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtDriving!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtDriving: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Driving"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={match.goodAtAuto!}
                  onChange={(event) => {
                    setMatch({
                      ...match,
                      goodAtAuto: event.currentTarget.checked,
                    });
                  }}
                />
              }
              label="Auto"
            />
          </FormGroup>
        </FormControl>
      </Stack>
      <Divider
        orientation="vertical"
        flexItem
      />
      <Stack
        sx={{
          flex: 1,
          padding: 2,
        }}
        gap={4}>
        <Stack
          sx={{
            width: 1,
          }}>
          <FormLabel>Data Confidence</FormLabel>
          <ToggleButtonGroup
            sx={{
              width: 1,
            }}>
            <StyledToggleButton
              value="Low Data Confidence?"
              selected={match.dataConfidence === "low"}
              onChange={() => {
                setMatch({
                  ...match,
                  dataConfidence: "low",
                });
              }}
              sx={{
                flex: 1,
              }}>
              Low
            </StyledToggleButton>
            <StyledToggleButton
              value="Neutral Data Confidence?"
              selected={match.dataConfidence === "neutral"}
              onChange={() => {
                setMatch({
                  ...match,
                  dataConfidence: "neutral",
                });
              }}
              sx={{
                flex: 1,
              }}>
              Neutral
            </StyledToggleButton>
            <StyledToggleButton
              value="High Data Confidence?"
              selected={match.dataConfidence === "high"}
              onChange={() => {
                setMatch({
                  ...match,
                  dataConfidence: "high",
                });
              }}
              sx={{
                flex: 1,
              }}>
              High
            </StyledToggleButton>
          </ToggleButtonGroup>
          <FormHelperText
            color="error"
            sx={{
              pl: 2,
              color: "error.main",
            }}>
            {dataConfidenceError}
          </FormHelperText>
        </Stack>
        <TextField
          label="Comments"
          value={match.comments}
          onChange={(event) => {
            setMatch({
              ...match,
              comments: event.currentTarget.value.replace(/"/g, "'"),
            });
          }}
          multiline
        />
      </Stack>
    </Stack>
  );
}
