import { DBEvent, Match } from "@ice-scout/api/src/utils/dbtypes.ts";
import { omit } from "@ice-scout/api/src/utils/utils.ts";
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
import { putDBEvent, putDBMatches } from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";

type DownloadEventProps = {
  downloadEvent: boolean;
  setDownloadEvent: (value: boolean) => void;
  events: (DBEvent & { matches: Match[] })[];
  setEvents: (value: (DBEvent & { matches: Match[] })[]) => void;
};
export default function DownloadEvent({
  downloadEvent,
  setDownloadEvent,
  events,
  setEvents,
}: DownloadEventProps) {
  const [eventKey, setEventKey] = useState("");
  const [eventKeyError, setEventKeyError] = useState("");

  const [frcStatus, setFrcStatus] = useState("");
  const [isaStatus, setIsaStatus] = useState("");
  const [tbaStatus, setTbaStatus] = useState("");

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
      setIsaStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);
    },
    onError(err) {
      setIsaStatus(err.message);
    },
  });
  const getFrcEvent = trpc.events.getFrcEvent.useMutation({
    onSuccess(data) {
      setFrcStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);
    },
    onError(err) {
      setFrcStatus(err.message);
    },
  });
  const getTbaEvent = trpc.events.getTbaEvent.useMutation({
    onSuccess(data) {
      setTbaStatus("Success");

      setEvents([...events.filter((x) => x.eventKey !== data.eventKey), data]);

      putDBEvent(omit(["matches"], data) as DBEvent);
      putDBMatches(data.matches);
    },
    onError(err) {
      setTbaStatus(err.message);
    },
  });

  return (
    <Dialog
      open={downloadEvent}
      onClose={() => {
        setDownloadEvent(false);
      }}>
      <DialogTitle>Download Event</DialogTitle>
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
                  setFrcStatus("Loading...");
                  getFrcEvent.mutate(eventKey);
                }
              }}>
              FRC
            </Button>
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
                if (!checkEventKey()) {
                  setTbaStatus("Loading...");
                  getTbaEvent.mutate(eventKey);
                }
              }}>
              TBA
            </Button>
          </Stack>
          <Box>
            {frcStatus ? "FRC API: " + frcStatus : ""}
            <br />
            {isaStatus ? "ISA Server: " + isaStatus : ""}
            <br />
            {tbaStatus ? "TBA API: " + tbaStatus : ""}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setDownloadEvent(false);
          }}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
