import { DBEvent, Match } from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { trpc } from "../utils/trpc.ts";

type ExportEventProps = {
  exportEvent: boolean;
  setExportEvent: (value: boolean) => void;
  events: (DBEvent & { matches: Match[] })[];
};
export default function ExportEvent({
  exportEvent,
  setExportEvent,
  events,
}: ExportEventProps) {
  const [eventKey, setEventKey] = useState("");
  const [eventKeyError, setEventKeyError] = useState("");

  const [isaStatus, setIsaStatus] = useState("");
  const [localStatus, setLocalStatus] = useState("");

  const checkEventKey = () => {
    let error = false;

    if (eventKey === "") {
      setEventKeyError("Cannot be empty");
      error = true;
    } else {
      setEventKeyError("");
    }

    return error;
  };

  const getEvent = trpc.events.getEvent.useMutation({
    onSuccess(data) {
      let csvContents =
        '"' + data.eventKey + '","' + data.eventName + '",,,,,,\n';
      data.matches.forEach((match) => {
        csvContents +=
          match.matchLevel +
          "," +
          match.matchNumber +
          "," +
          match.red1 +
          "," +
          match.red2 +
          "," +
          match.blue1 +
          "," +
          match.blue2 +
          "\n";
      });

      const a = document.createElement("a");
      a.setAttribute(
        "href",
        URL.createObjectURL(
          new Blob([csvContents], {
            type: "text/csv",
          })
        )
      );
      a.setAttribute("download", data.eventKey + ".csv");
      a.setAttribute("target", "_blank");
      a.click();
      setIsaStatus("Success");
    },
    onError(err) {
      setIsaStatus(err.message);
    },
  });

  return (
    <Dialog
      open={exportEvent}
      onClose={() => {
        setExportEvent(false);
      }}>
      <DialogTitle>Export Event</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            pt: 2,
          }}
          gap={2}>
          <TextField
            value={eventKey}
            onChange={(event) => {
              setEventKey(event.currentTarget.value);
            }}
            label="eventKey"
            error={eventKeyError !== ""}
            helperText={eventKeyError}
          />

          <Stack
            direction="row"
            gap={2}
            sx={{
              width: 1,
            }}>
            <Button
              variant="outlined"
              sx={{
                flex: 1,
              }}
              onClick={() => {
                if (!checkEventKey()) {
                  setIsaStatus("Loading...");
                  getEvent.mutate(eventKey);
                }
              }}>
              ISA
            </Button>
            <Button
              variant="outlined"
              sx={{
                flex: 1,
              }}
              onClick={() => {
                const currentEvent = events.find(
                  (event) => event.eventKey === eventKey
                );

                if (currentEvent) {
                  let csvContents =
                    '"' +
                    currentEvent.eventKey +
                    '","' +
                    currentEvent.eventName +
                    '",,,,,,\n';
                  currentEvent.matches.forEach((match) => {
                    csvContents +=
                      match.matchLevel +
                      "," +
                      match.matchNumber +
                      "," +
                      match.red1 +
                      "," +
                      match.red2 +
                      "," +
                      match.blue1 +
                      "," +
                      match.blue2 +
                      "\n";
                  });

                  const a = document.createElement("a");
                  a.setAttribute(
                    "href",
                    URL.createObjectURL(
                      new Blob([csvContents], {
                        type: "text/csv",
                      })
                    )
                  );
                  a.setAttribute("download", currentEvent.eventKey + ".csv");
                  a.setAttribute("target", "_blank");
                  a.click();
                  setLocalStatus("Success");
                } else {
                  setLocalStatus("Event not found");
                }
              }}>
              Local
            </Button>
          </Stack>
          <Box>
            {isaStatus ? "ISA Server: " + isaStatus : ""}
            <br />
            {localStatus ? "Local: " + localStatus : ""}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setExportEvent(false);
          }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
