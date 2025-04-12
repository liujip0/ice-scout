import { Add, Remove } from "@mui/icons-material";
import { Button, Stack, TextField, Divider } from "@mui/material";

type BigCounterProps = {
  value: number;
  increment: () => void;
  decrement: () => void;
  label: string;
  max?: number;
  disabled?: boolean;
};
export function BigCounter({
  value,
  increment,
  decrement,
  label,
  max,
  disabled = false,
}: BigCounterProps) {
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, sm: 1 }}
      useFlexGap
      sx={{
        width: 1,
      }}>
      <Button
        onClick={() => {
          if (value > 0) {
            decrement();
          }
        }}
        variant="contained"
        disabled={disabled}>
        <Remove />
      </Button>
      <TextField
        value={value}
        label={label}
        disabled={disabled}
        sx={{
          flex: 1,
        }}
      />
      <Button
        onClick={() => {
          if (max === undefined || value < max) {
            increment();
          }
        }}
        variant="contained"
        disabled={disabled}>
        <Add />
      </Button>
    </Stack>
  );
}
