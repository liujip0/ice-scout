import { TeamMatchEntry } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Stack, TextField } from "@mui/material";

type PostmatchProps = {
  match: TeamMatchEntry;
  setMatch: (value: TeamMatchEntry) => void;
};
export default function Postmatch({ match, setMatch }: PostmatchProps) {
  return (
    <Stack
      direction="column"
      sx={{
        width: 1,
        height: "auto",
      }}>
      <Stack
        sx={{
          flex: 1,
          padding: 2,
        }}
        gap={2}></Stack>
      <Stack
        sx={{
          flex: 1,
          padding: 2,
        }}
        gap={2}>
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
