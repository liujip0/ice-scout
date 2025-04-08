import {
  DBEvent,
  HumanPlayerEntry,
  HumanPlayerEntryColumn,
  HumanPlayerEntryColumns,
  HumanPlayerEntryInit,
  Match,
  TeamMatchEntry,
  TeamMatchEntryColumn,
  TeamMatchEntryColumns,
  TeamMatchEntryInit,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  matchFileName,
  matchLevelAbbrev,
  omit,
} from "@ice-scout/api/src/utils/utils.ts";
import {
  Close,
  CloudSync,
  ContentCopy,
  Download,
  QrCode,
  SendToMobile,
  Star,
  Upload,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  lighten,
  List,
  ListItem,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCODE_UPLOAD_DELIMITER } from "../upload/Upload.tsx";
import {
  deleteEntry,
  getDBHumanPlayerEntries,
  getDBTeamMatchEntries,
  putDBEntry,
} from "../utils/idb.ts";
import { trpc } from "../utils/trpc.ts";
import { ScoutPageContainer } from "./ScoutPageContainer.tsx";

export type ExportMatchEntry = (TeamMatchEntry | HumanPlayerEntry) & {
  autoUpload: boolean;
  quickshare: boolean;
  clipboard: boolean;
  qr: boolean;
  download: boolean;
  upload: boolean;
};

type SavedMatchesProps = {
  match: TeamMatchEntry | HumanPlayerEntry;
  setMatch: (value: TeamMatchEntry | HumanPlayerEntry) => void;
  events: (DBEvent & { matches: Match[] })[];
};
export default function SavedMatches({
  match,
  setMatch,
  events,
}: SavedMatchesProps) {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<
    (ExportMatchEntry & {
      selected: boolean;
    })[]
  >([]);
  useEffect(() => {
    getDBTeamMatchEntries().then((robotMatches) => {
      getDBHumanPlayerEntries().then((humanMatches) => {
        setMatches([
          ...robotMatches.map((x) => ({
            ...x,
            selected:
              (
                !x.autoUpload &&
                !x.quickshare &&
                !x.clipboard &&
                !x.qr &&
                !x.download &&
                !x.upload
              ) ?
                true
              : false,
          })),
          ...humanMatches.map((x) => ({
            ...x,
            selected:
              (
                !x.autoUpload &&
                !x.quickshare &&
                !x.clipboard &&
                !x.qr &&
                !x.download &&
                !x.upload
              ) ?
                true
              : false,
          })),
        ]);
      });
    });
  }, []);

  const markExportedEntries = (
    method:
      | "autoUpload"
      | "quickshare"
      | "clipboard"
      | "qr"
      | "download"
      | "upload"
  ) => {
    setMatches(
      matches.map((x): ExportMatchEntry & { selected: boolean } => {
        if (x.selected) {
          putDBEntry({
            ...omit(["selected"], x as unknown as Record<string, unknown>),
            [method]: true,
          } as ExportMatchEntry);
          console.log({
            ...omit(["selected"], x as unknown as Record<string, unknown>),
            [method]: true,
          } as ExportMatchEntry);
          return {
            ...x,
            [method]: true,
          };
        } else {
          return x;
        }
      })
    );
  };

  const [quickshareFailed, setQuickshareFailed] = useState("");
  const [confirmDeleteMatch, setConfirmDeleteMatch] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const putEntries = trpc.data.putEntries.useMutation({
    onSuccess() {
      setUploadStatus("Success");
      markExportedEntries("upload");
    },
    onError(error) {
      setUploadStatus("Error: " + error.message);
    },
  });

  const [qrMatches, setQrMatches] = useState<string[]>([]);
  const [qrIndex, setQrIndex] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <ScoutPageContainer
      title="Saved Matches"
      navButtons={
        <>
          <Button
            variant="outlined"
            onClick={() => {
              navigate("/scout");
            }}>
            Back
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigate("/");
            }}>
            Home
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log(getDBTeamMatchEntries());
              const newMatch: TeamMatchEntry | HumanPlayerEntry = {
                ...(match.robotNumber !== 4 ?
                  TeamMatchEntryInit
                : HumanPlayerEntryInit),
                deviceTeamNumber: match.deviceTeamNumber,
                deviceId: match.deviceId,
                eventKey: match.eventKey,
                matchLevel: match.matchLevel,
                matchNumber: match.matchNumber + 1,
                alliance: match.alliance,
                robotNumber: match.robotNumber,
                scoutName: match.scoutName,
                scoutTeamNumber: match.scoutTeamNumber,
              } as TeamMatchEntry | HumanPlayerEntry;

              const eventMatches = events.find(
                (event) => event.eventKey === match.eventKey
              )?.matches;
              if (
                eventMatches?.some(
                  (x) =>
                    x.matchLevel === match.matchLevel &&
                    x.matchNumber === match.matchNumber + 1
                ) &&
                match.robotNumber !== 4
              ) {
                setMatch({
                  ...newMatch,
                  teamNumber: eventMatches.find(
                    (x) =>
                      x.matchLevel === match.matchLevel &&
                      x.matchNumber === match.matchNumber + 1
                  )![
                    (match.alliance.toLowerCase() + match.robotNumber) as
                      | "red1"
                      | "red2"
                      | "red3"
                      | "blue1"
                      | "blue2"
                      | "blue3"
                  ],
                });
              } else {
                setMatch({
                  ...newMatch,
                  teamNumber: 0,
                });
              }
              navigate("/scout");
            }}>
            Next Match
          </Button>
        </>
      }>
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
          }}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-evenly",
              marginBottom: 2,
            }}
            gap={2}>
            <Button
              onClick={() => {
                console.log(getDBTeamMatchEntries());
                if (matches.every((x) => x.selected)) {
                  setMatches(
                    matches.map((x) => ({
                      ...x,
                      selected: false,
                    }))
                  );
                } else {
                  setMatches(
                    matches.map((x) => ({
                      ...x,
                      selected: true,
                    }))
                  );
                }
              }}
              variant="outlined">
              {matches.every((x) => x.selected) ? "Deselect All" : "Select All"}
            </Button>
            <Button
              onClick={() => {
                if (matches.some((x) => x.selected)) {
                  setConfirmDeleteMatch(true);
                }
              }}
              variant="outlined">
              Delete
            </Button>
            <Dialog
              open={confirmDeleteMatch}
              onClose={() => {
                setConfirmDeleteMatch(false);
              }}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <Stack>
                  <Typography>
                    Are you sure you want to delete the following matches? This
                    cannot be undone.
                  </Typography>
                  <List
                    sx={{
                      listStyleType: "disc",
                      paddingLeft: 4,
                    }}>
                    {matches
                      .filter((x) => x.selected)
                      .map((x) => (
                        <ListItem
                          key={
                            x.eventKey +
                            "_" +
                            x.matchLevel +
                            x.matchNumber +
                            "_" +
                            x.alliance +
                            "_" +
                            x.robotNumber +
                            "_" +
                            x.deviceTeamNumber +
                            "_" +
                            x.deviceId
                          }
                          sx={{
                            display: "list-item",
                          }}>
                          <Typography>
                            {x.eventKey +
                              "_" +
                              matchLevelAbbrev(x.matchLevel) +
                              x.matchNumber +
                              " " +
                              x.alliance +
                              " " +
                              x.robotNumber}
                          </Typography>
                        </ListItem>
                      ))}
                  </List>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setConfirmDeleteMatch(false);
                  }}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    for (const i of matches.filter((x) => x.selected)) {
                      await deleteEntry(i);
                    }
                    setMatches(matches.filter((x) => !x.selected));
                    setConfirmDeleteMatch(false);
                  }}>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
          <Stack
            sx={{
              flex: 1,
              overflowY: "scroll",
            }}
            gap={1}>
            {matches.map((matchData, index) => (
              <Paper
                key={index}
                sx={(theme) => ({
                  padding: 2,
                  borderColor: "primary.main",
                  borderWidth: 2,
                  borderStyle: "solid",
                  backgroundColor: lighten(
                    theme.palette.background.default,
                    0.5
                  ),
                  cursor: "pointer",
                })}
                onClick={() => {
                  setMatches(
                    matches.map((x) =>
                      (
                        x.eventKey === matchData.eventKey &&
                        x.matchLevel === matchData.matchLevel &&
                        x.matchNumber === matchData.matchNumber &&
                        x.alliance === matchData.alliance &&
                        x.robotNumber === matchData.robotNumber
                      ) ?
                        {
                          ...matchData,
                          selected: !x.selected,
                        }
                      : x
                    )
                  );
                }}>
                <FormControlLabel
                  checked={matchData.selected}
                  control={<Checkbox />}
                  slotProps={{
                    typography: {
                      width: 1,
                    },
                  }}
                  sx={{
                    width: 1,
                  }}
                  label={
                    <Stack
                      direction="row"
                      gap={2}
                      onClick={(event) => {
                        event.preventDefault();
                        setMatches(
                          matches.map((x) =>
                            (
                              x.eventKey === matchData.eventKey &&
                              x.matchLevel === matchData.matchLevel &&
                              x.matchNumber === matchData.matchNumber &&
                              x.alliance === matchData.alliance &&
                              x.robotNumber === matchData.robotNumber
                            ) ?
                              {
                                ...matchData,
                                selected: !x.selected,
                              }
                            : x
                          )
                        );
                      }}>
                      <Stack
                        sx={{
                          flex: 1,
                        }}>
                        <Typography
                          sx={{
                            fontWeight:
                              (
                                !matchData.autoUpload &&
                                !matchData.quickshare &&
                                !matchData.clipboard &&
                                !matchData.qr &&
                                !matchData.download &&
                                !matchData.upload
                              ) ?
                                "bold"
                              : "normal",
                          }}>
                          {matchData.eventKey +
                            "_" +
                            matchLevelAbbrev(matchData.matchLevel) +
                            matchData.matchNumber}
                        </Typography>
                        <Stack
                          direction="row"
                          gap={2}>
                          <Typography
                            sx={{
                              fontWeight:
                                (
                                  !matchData.autoUpload &&
                                  !matchData.quickshare &&
                                  !matchData.clipboard &&
                                  !matchData.qr &&
                                  !matchData.download &&
                                  !matchData.upload
                                ) ?
                                  "bold"
                                : "normal",
                            }}>
                            {"\n" +
                              matchData.alliance +
                              "\u00a0" +
                              (matchData.robotNumber === 4 ?
                                "HUMAN"
                              : matchData.robotNumber)}
                          </Typography>
                          <Stack
                            direction="row"
                            sx={{
                              alignItems: "center",
                              overflowX: "scroll",
                            }}>
                            {matchData.autoUpload && <CloudSync />}
                            {matchData.quickshare && <SendToMobile />}
                            {matchData.clipboard && <ContentCopy />}
                            {matchData.qr && <QrCode />}
                            {matchData.download && <Download />}
                            {matchData.upload && <Upload />}
                          </Stack>
                        </Stack>
                      </Stack>
                      {!matchData.autoUpload &&
                        !matchData.quickshare &&
                        !matchData.clipboard &&
                        !matchData.qr &&
                        !matchData.download &&
                        !matchData.upload && <Star />}
                    </Stack>
                  }
                />
              </Paper>
            ))}
          </Stack>
        </Stack>
        <Divider orientation="vertical" />
        <Stack
          sx={{
            flex: 1,
            padding: 2,
          }}
          gap={2}>
          <Button
            variant="outlined"
            onClick={async () => {
              const data: (TeamMatchEntry | HumanPlayerEntry)[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as (TeamMatchEntry | HumanPlayerEntry)[];

              let exception = false;
              try {
                await navigator.share({
                  title: "ISA Match Data",
                  text: JSON.stringify(data),
                  files: data.map(
                    (x) =>
                      new File([JSON.stringify(x)], matchFileName(x) + ".txt", {
                        type: "text/plain",
                      })
                  ),
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                exception = true;
                console.log(error);
                setQuickshareFailed(error.toString() as string);
              }
              if (!exception) {
                markExportedEntries("quickshare");
              }
            }}
            startIcon={<SendToMobile />}>
            Share via Quickshare
          </Button>
          <Snackbar
            open={quickshareFailed !== ""}
            autoHideDuration={3000}
            onClose={() => {
              setQuickshareFailed("");
            }}
            message={quickshareFailed}
            action={
              <IconButton
                onClick={() => {
                  setQuickshareFailed("");
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
            variant="outlined"
            onClick={() => {
              const data: (TeamMatchEntry | HumanPlayerEntry)[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as (TeamMatchEntry | HumanPlayerEntry)[];

              let exception = false;
              try {
                navigator.clipboard.writeText(JSON.stringify(data));
              } catch {
                exception = true;
              }

              if (!exception) {
                markExportedEntries("clipboard");
              }
            }}
            startIcon={<ContentCopy />}>
            Copy to Clipboard
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              setQrMatches(
                matches
                  .filter((x) => x.selected)
                  .map(
                    (x) =>
                      (x.robotNumber === 4 ?
                        JSON.stringify(
                          HumanPlayerEntryColumns.map(
                            (column) => x[column as HumanPlayerEntryColumn]
                          )
                        )
                      : JSON.stringify(
                          TeamMatchEntryColumns.map(
                            (column) => x[column as TeamMatchEntryColumn]
                          )
                        )) + QRCODE_UPLOAD_DELIMITER
                  )
              );
              setQrIndex(0);
              console.log(
                matches
                  .filter((x) => x.selected)
                  .map(
                    (x) =>
                      (x.robotNumber === 4 ?
                        JSON.stringify(
                          HumanPlayerEntryColumns.map(
                            (column) => x[column as HumanPlayerEntryColumn]
                          )
                        )
                      : JSON.stringify(
                          TeamMatchEntryColumns.map(
                            (column) => x[column as TeamMatchEntryColumn]
                          )
                        )) + QRCODE_UPLOAD_DELIMITER
                  )
                  .join("")
              );
            }}
            startIcon={<QrCode />}>
            Share via QR Code
          </Button>
          <Dialog open={qrMatches.length > 0}>
            <DialogTitle>
              QR Code {qrIndex + 1} of {qrMatches.length}
            </DialogTitle>
            <DialogContent>
              <Box ref={qrRef}>
                <QRCodeSVG
                  value={qrMatches[qrIndex]}
                  size={Math.min(
                    (60 * innerWidth) / 100,
                    (60 * innerHeight) / 100
                  )}
                  marginSize={4}
                />
              </Box>
            </DialogContent>
            <DialogActions
              sx={{
                pl: 4,
                pr: 4,
                pb: 4,
              }}>
              {qrMatches.length === 1 ?
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrMatches([]);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      markExportedEntries("qr");
                      setQrMatches([]);
                    }}>
                    Done
                  </Button>
                </>
              : qrIndex === 0 ?
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrMatches([]);
                    }}>
                    Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrIndex(qrIndex + 1);
                    }}>
                    Next
                  </Button>
                </>
              : qrIndex === qrMatches.length - 1 ?
                <>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrIndex(qrIndex - 1);
                    }}>
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      markExportedEntries("qr");
                      setQrMatches([]);
                    }}>
                    Done
                  </Button>
                </>
              : <>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrIndex(qrIndex - 1);
                    }}>
                    Previous
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                    }}
                    onClick={() => {
                      setQrIndex(qrIndex + 1);
                    }}>
                    Next
                  </Button>
                </>
              }
            </DialogActions>
          </Dialog>

          <Button
            variant="outlined"
            onClick={() => {
              const data: (TeamMatchEntry | HumanPlayerEntry)[] = matches
                .filter((x) => x.selected)
                .map((x) =>
                  omit(
                    [
                      "autoUpload",
                      "quickshare",
                      "clipboard",
                      "qr",
                      "download",
                      "upload",
                      "selected",
                    ],
                    x as unknown as Record<string, unknown>
                  )
                ) as unknown as (TeamMatchEntry | HumanPlayerEntry)[];

              let exception = false;
              try {
                const downloadInterval = setInterval(() => {
                  const x = data.pop();
                  console.log(x && x.matchLevel + x.matchNumber);
                  if (!x) {
                    clearInterval(downloadInterval);
                    return;
                  }

                  const a = document.createElement("a");
                  a.setAttribute(
                    "href",
                    URL.createObjectURL(
                      new Blob([JSON.stringify(x)], {
                        type: "text/plain",
                      })
                    )
                  );
                  a.setAttribute("download", matchFileName(x) + ".txt");
                  a.setAttribute("target", "_blank");
                  a.click();

                  if (data.length <= 0) {
                    clearInterval(downloadInterval);

                    if (!exception) {
                      markExportedEntries("download");
                    }
                  }
                }, 300);
              } catch {
                exception = true;
              }
            }}
            startIcon={<Download />}>
            Download Data Files
          </Button>

          <Button
            variant="outlined"
            onClick={() => {
              console.log(
                matches
                  .filter((x) => x.selected)
                  .map((x) =>
                    omit(
                      [
                        "autoUpload",
                        "quickshare",
                        "clipboard",
                        "qr",
                        "download",
                        "upload",
                        "selected",
                      ],
                      x as unknown as Record<string, unknown>
                    )
                  ) as unknown as (TeamMatchEntry | HumanPlayerEntry)[]
              );
              putEntries.mutate(
                matches
                  .filter((x) => x.selected)
                  .map((x) =>
                    omit(
                      [
                        "autoUpload",
                        "quickshare",
                        "clipboard",
                        "qr",
                        "download",
                        "upload",
                        "selected",
                      ],
                      x as unknown as Record<string, unknown>
                    )
                  ) as (TeamMatchEntry | HumanPlayerEntry)[]
              );
            }}
            startIcon={<Upload />}>
            Direct Upload
          </Button>
          <Snackbar
            open={uploadStatus !== ""}
            autoHideDuration={3000}
            onClose={() => {
              setUploadStatus("");
            }}
            message={uploadStatus}
            action={
              <IconButton
                onClick={() => {
                  setUploadStatus("");
                }}>
                <Close
                  sx={{
                    color: "#ffffff",
                  }}
                />
              </IconButton>
            }
          />
        </Stack>
      </Stack>
    </ScoutPageContainer>
  );
}
