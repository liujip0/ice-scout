import {
  CommonEntryColumns,
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  Close,
  ContentPaste,
  FileUpload,
  QrCodeScanner,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput.tsx";
import { trpc } from "../utils/trpc.ts";

export const QRCODE_UPLOAD_DELIMITER = "`";

export default function Upload() {
  const navigate = useNavigate();

  const [status, setStatus] = useState("");

  const putEntries = trpc.data.putEntries.useMutation({
    onSuccess() {
      setStatus("Success");
    },
    onError(error) {
      setStatus("Error: " + error.message);
    },
  });

  const [qrUpload, setQrUpload] = useState(false);
  const [qrData, setQrData] = useState("");

  return (
    <Stack
      sx={{
        backgroundColor: "background.default",
        width: 1,
        height: 1,
        justifyContent: "center",
      }}>
      <Snackbar
        open={status !== ""}
        autoHideDuration={3000}
        onClose={() => {
          setStatus("");
        }}
        message={status}
        action={
          <IconButton
            onClick={() => {
              setStatus("");
            }}>
            <Close
              sx={{
                color: "#ffffff",
              }}
            />
          </IconButton>
        }
      />

      <Button
        component="label"
        startIcon={<FileUpload />}>
        Upload TXT Files
        <VisuallyHiddenInput
          type="file"
          accept="text/plain"
          onChange={async (event) => {
            if (event.currentTarget.files) {
              const matches: TeamMatchEntry[] = [];

              for (const file of event.currentTarget.files) {
                const match = JSON.parse(await file.text());
                console.log(match);
                matches.push(match);
              }

              putEntries.mutate(matches);
            }
          }}
          multiple
        />
      </Button>

      <Button
        onClick={async () => {
          const matches = JSON.parse(await navigator.clipboard.readText());
          putEntries.mutate(matches);
        }}
        startIcon={<ContentPaste />}>
        Paste from Clipboard
      </Button>

      <Button
        onClick={() => {
          setQrUpload(true);
        }}
        startIcon={<QrCodeScanner />}>
        Scan QR with Scanner
      </Button>
      <Dialog open={qrUpload}>
        <DialogTitle>Scan QR Codes</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            value={qrData}
            onChange={(event) => {
              setQrData(event.currentTarget.value);
            }}
            helperText={
              "1.Connect the QR code scanner\u00a0\u00a02.Focus the textbox\u00a0\u00a03.Scan QR codes"
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setQrUpload(false);
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const matchArrs: string[] = qrData
                .split(QRCODE_UPLOAD_DELIMITER)
                .filter((x) => x.trim() !== "");
              const matches: TeamMatchEntry[] = matchArrs.map((match) => {
                const matchArr = JSON.parse(match);
                const parsedMatch: Partial<
                  Record<TeamMatchEntryColumn, unknown>
                > = {};
                CommonEntryColumns.forEach((column, columnIndex) => {
                  parsedMatch[column] = matchArr[columnIndex];
                });
                TeamMatchEntryColumns.forEach((column, columnIndex) => {
                  parsedMatch[column] = matchArr[columnIndex];
                });

                console.log(parsedMatch);
                return parsedMatch as TeamMatchEntry;
              });
              putEntries.mutate(matches);
              setQrData("");
              setQrUpload(false);
            }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Button
        onClick={() => {
          //TODO
        }}
        startIcon={<CameraAlt />}>
        Scan QR with Camera
      </Button> */}

      <Button onClick={() => {}}>&nbsp;</Button>

      <Button
        onClick={() => {
          navigate("/");
        }}>
        Return to Home
      </Button>
    </Stack>
  );
}
