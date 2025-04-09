import {
  DBEvent,
  Match,
  MatchColumns,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { omit } from "@ice-scout/api/src/utils/utils.ts";
import { Delete, Done } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Overwrite } from "@trpc/server/unstable-core-do-not-import";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Th } from "../components/Table.tsx";
import { putDBEvent, putDBMatches } from "../utils/idb.ts";

//TODO: either improve or delete this

type CreateEventProps = {
  createEvent: boolean;
  setCreateEvent: (value: boolean) => void;
  events: (DBEvent & { matches: Match[] })[];
  setEvents: (value: (DBEvent & { matches: Match[] })[]) => void;
};
export default function CreateEvent({
  createEvent,
  setCreateEvent,
  events,
  setEvents,
}: CreateEventProps) {
  const [newEvent, setNewEvent] = useState<DBEvent & { matches: Match[] }>({
    eventKey: "",
    eventName: "",
    matches: [],
  });
  const closeCreateEvent = () => {
    setCreateEvent(false);
  };
  const [newMatch, setNewMatch] = useState<
    Overwrite<
      Match,
      {
        red1: string;
        red2: string;
        blue1: string;
        blue2: string;
      }
    >
  >({
    eventKey: "",
    matchLevel: "Qualification",
    matchNumber: 0,
    red1: "",
    red2: "",
    blue1: "",
    blue2: "",
  });
  const setNewEventMatch = (match: Match) => {
    const newMatches = newEvent.matches.filter(
      (x) =>
        x.matchLevel !== match.matchLevel || x.matchNumber !== match.matchNumber
    );
    newMatches.push(match);
    setNewEvent({
      ...newEvent,
      matches: newMatches,
    });
  };

  return (
    <Dialog
      open={createEvent}
      onClose={closeCreateEvent}
      PaperProps={{
        sx: {
          width: "max-content",
          maxWidth: "90vw",
        },
      }}>
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            mt: 1,
          }}
          gap={2}>
          <Stack
            direction="row"
            gap={2}>
            <TextField
              value={newEvent.eventKey}
              onChange={(event) => {
                setNewEvent({
                  ...newEvent,
                  eventKey: event.currentTarget.value,
                });
                setNewMatch({
                  ...newMatch,
                  eventKey: event.currentTarget.value,
                });
              }}
              label="Event Code"
            />
            <TextField
              value={newEvent.eventName}
              onChange={(event) => {
                setNewEvent({
                  ...newEvent,
                  eventName: event.currentTarget.value,
                });
              }}
              label="Event Name"
            />
          </Stack>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {MatchColumns.map((column) =>
                    column !== "eventKey" ?
                      <Th key={column}>{column}</Th>
                    : <Fragment key={column}></Fragment>
                  )}
                  <Th>Actions</Th>
                </TableRow>
              </TableHead>
              <TableBody>
                {newEvent.matches.map((match) => (
                  <TableRow key={match.matchLevel + match.matchNumber}>
                    {MatchColumns.map((column) =>
                      column !== "eventKey" ?
                        <TableCell
                          key={column}
                          sx={{
                            pt: 0.5,
                            pb: 0.5,
                          }}>
                          {match[column]}
                        </TableCell>
                      : <Fragment key={column}></Fragment>
                    )}
                    <TableCell
                      sx={{
                        padding: 0.5,
                      }}>
                      <Stack direction="row">
                        <IconButton
                          onClick={() => {
                            setNewEvent({
                              ...newEvent,
                              matches: newEvent.matches.filter(
                                (x) =>
                                  x.matchLevel !== match.matchLevel ||
                                  x.matchNumber !== match.matchNumber
                              ),
                            });
                          }}
                          color="primary">
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  {MatchColumns.map((column) =>
                    column !== "eventKey" ?
                      <TableCell
                        key={column}
                        sx={{
                          padding: 0.5,
                        }}>
                        <TextField
                          value={newMatch[column]}
                          onChange={(event) => {
                            setNewMatch({
                              ...newMatch,
                              [column]: event.currentTarget.value,
                            });
                          }}
                          slotProps={{
                            input: {
                              sx: {
                                padding: 0,
                              },
                            },
                            htmlInput: {
                              sx: {
                                padding: 1,
                              },
                            },
                          }}
                        />
                      </TableCell>
                    : <Fragment key={column}></Fragment>
                  )}
                  <TableCell
                    sx={{
                      padding: 0.5,
                    }}>
                    <Stack direction="row">
                      <IconButton
                        onClick={() => {
                          setNewEventMatch({
                            ...newMatch,
                            red1: parseInt(newMatch.red1),
                            red2: parseInt(newMatch.red2),
                            blue1: parseInt(newMatch.blue1),
                            blue2: parseInt(newMatch.blue2),
                          });
                          setNewMatch({
                            eventKey: newEvent.eventKey,
                            matchLevel: "Qualification",
                            matchNumber: 0,
                            red1: "",
                            red2: "",
                            blue1: "",
                            blue2: "",
                          });
                        }}
                        color="primary">
                        <Done />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeCreateEvent}>Cancel</Button>
        <Button
          onClick={() => {
            setEvents([
              ...events.filter((event) => event.eventKey !== newEvent.eventKey),
              newEvent,
            ]);
            putDBEvent(omit(["matches"], newEvent) as DBEvent);
            putDBMatches(newEvent.matches);
            closeCreateEvent();
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
