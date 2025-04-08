import {
  HumanPlayerEntryColumns,
  HumanPlayerEntryInit,
  TeamMatchEntryColumns,
  TeamMatchEntryInit,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { dateFileName } from "@ice-scout/api/src/utils/utils.ts";
import {
  ContentCopy,
  Contrast,
  Error,
  FormatQuote,
  Numbers,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  lighten,
  Stack,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  borderWidth: 3,
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.5),
    "&:hover": {
      backgroundColor: lighten(theme.palette.primary.light, 0.5),
    },
  },
}));

type ExportLayoutProps = {
  showPublicApiToken: boolean;
  setShowPublicApiToken: (value: boolean) => void;
  linkIncludesToken: boolean;
  setLinkIncludesToken: (value: boolean) => void;
  showAuthorization: boolean;
  setShowAuthorization: (value: boolean) => void;
  publicApiToken: string | undefined;
  robotColumnsState: boolean[];
  setRobotColumnsState: (value: boolean[]) => void;
  humanColumnsState: boolean[];
  setHumanColumnsState: (value: boolean[]) => void;
  linkBase: string;
  events: string;
  setEvents: (value: string) => void;
  teams: string;
  setTeams: (value: string) => void;
};
export default function ExportLayout({
  showPublicApiToken,
  setShowPublicApiToken,
  linkIncludesToken,
  setLinkIncludesToken,
  showAuthorization,
  setShowAuthorization,
  publicApiToken,
  robotColumnsState,
  setRobotColumnsState,
  humanColumnsState,
  setHumanColumnsState,
  linkBase,
  events,
  setEvents,
  teams,
  setTeams,
}: ExportLayoutProps) {
  const [fileType, setFileType] = useState<"json" | "csv" | "xlsx">("json");

  const getApiLink = () => {
    return (
      import.meta.env.VITE_SERVER_URL +
      linkBase +
      fileType +
      "?include=" +
      (robotColumnsState.length > 0 ?
        robotColumnsState.map((value) => (value ? "1" : "0")).join("")
      : "") +
      (humanColumnsState.length > 0 ?
        humanColumnsState.map((value) => (value ? "1" : "0")).join("")
      : "") +
      (events ?
        events
          .split(",")
          .map((event) => "&event=" + event.trim())
          .join("")
      : "") +
      (teams ?
        teams
          .split(",")
          .filter((team) => !isNaN(parseInt(team.trim())))
          .map((team) => "&team=" + team.trim())
          .join("")
      : "") +
      (linkIncludesToken ? "&token=" + publicApiToken : "")
    );
  };

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        padding: 2,
      }}
      direction="row">
      <Stack
        sx={{
          flex: 1,
          padding: 1,
          height: 1,
        }}>
        {robotColumnsState.length > 0 && (
          <>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                textWrap: "wrap",
              }}>
              Select columns to include in robot data
            </Typography>
            <Stack
              sx={{
                flex: 1,
                height: 1,
                overflowY: "scroll",
                mb: 2,
              }}>
              {TeamMatchEntryColumns.map((column, columnIndex) => {
                return (
                  <FormControlLabel
                    key={column}
                    checked={robotColumnsState[columnIndex]}
                    onChange={(_event, checked) => {
                      setRobotColumnsState(
                        robotColumnsState.map((value, valueIndex) =>
                          valueIndex === columnIndex ? checked : value
                        )
                      );
                    }}
                    control={<Checkbox />}
                    label={
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                        }}
                        gap={1}>
                        <Typography>
                          {column.startsWith("auto") ?
                            column.replace("auto", "auto\u200b")
                          : column.startsWith("teleop") ?
                            column.replace("teleop", "teleop\u200b")
                          : column.startsWith("endgame") ?
                            column.replace("endgame", "endgame\u200b")
                          : column.startsWith("postmatch") ?
                            column.replace("postmatch", "postmatch\u200b")
                          : column}
                        </Typography>
                        {
                          {
                            boolean: <DataTypeIcon dataType="boolean" />,
                            string:
                              column === "alliance" ?
                                <DataTypeIcon dataType='"Red" | "Blue"' />
                              : column === "matchLevel" ?
                                <DataTypeIcon dataType='"None" | "Practice" | "Qualification" | "Playoff"' />
                              : <DataTypeIcon dataType="string" />,
                            number:
                              column === "robotNumber" ?
                                <DataTypeIcon dataType="1 | 2 | 3" />
                              : <DataTypeIcon dataType="integer" />,
                            bigint: <DataTypeIcon dataType="error" />,
                            symbol: <DataTypeIcon dataType="error" />,
                            function: <DataTypeIcon dataType="error" />,
                            object:
                              (
                                [
                                  "tbaAutoLine",
                                  "tbaEndgamePark",
                                  "tbaEndgameShallow",
                                  "tbaEndgameDeep",
                                ].includes(column)
                              ) ?
                                <DataTypeIcon dataType="boolean" />
                              : <DataTypeIcon dataType="error" />,
                            undefined: <DataTypeIcon dataType="error" />,
                          }[typeof TeamMatchEntryInit[column]]
                        }
                      </Stack>
                    }
                  />
                );
              })}
            </Stack>
          </>
        )}
        {humanColumnsState.length > 0 && (
          <>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                textWrap: "wrap",
              }}>
              Select columns to include in human data
            </Typography>
            <Stack
              sx={{
                flex: 1,
                height: 1,
                overflowY: "scroll",
              }}>
              {HumanPlayerEntryColumns.map((column, columnIndex) => (
                <FormControlLabel
                  key={column}
                  checked={humanColumnsState[columnIndex]}
                  onChange={(_event, checked) => {
                    setHumanColumnsState(
                      humanColumnsState.map((value, valueIndex) =>
                        valueIndex === columnIndex ? checked : value
                      )
                    );
                  }}
                  control={<Checkbox />}
                  label={
                    <Stack
                      direction="row"
                      sx={{
                        alignItems: "center",
                      }}
                      gap={1}>
                      <Typography>{column}</Typography>
                      {
                        {
                          boolean: <DataTypeIcon dataType="boolean" />,
                          string:
                            column === "alliance" ?
                              <DataTypeIcon dataType='"Red" | "Blue"' />
                            : column === "matchLevel" ?
                              <DataTypeIcon dataType='"None" | "Practice" | "Qualification" | "Playoff"' />
                            : <DataTypeIcon dataType="string" />,
                          number:
                            column === "robotNumber" ?
                              <DataTypeIcon dataType="4" />
                            : <DataTypeIcon dataType="integer" />,
                          bigint: <DataTypeIcon dataType="error" />,
                          symbol: <DataTypeIcon dataType="error" />,
                          function: <DataTypeIcon dataType="error" />,
                          object:
                            ["tbaMaxAlgaeAttempts"].includes(column) ?
                              <DataTypeIcon dataType="integer" />
                            : <DataTypeIcon dataType="error" />,
                          undefined: <DataTypeIcon dataType="error" />,
                        }[typeof HumanPlayerEntryInit[column]]
                      }
                    </Stack>
                  }
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>
      <Divider orientation="vertical" />
      <Stack
        sx={{
          flex: 1,
          padding: 2,
          overflowY: "scroll",
        }}
        gap={1}>
        <TextField
          value={events}
          onChange={(event) => {
            setEvents(event.currentTarget.value);
          }}
          label="Events (comma-separated)"
        />
        <TextField
          value={teams}
          onChange={(event) => {
            setTeams(event.currentTarget.value);
          }}
          label="Teams (comma-separated)"
        />
        <Divider
          sx={{
            mt: 2,
            mb: 2,
          }}
        />
        <ToggleButtonGroup
          value={fileType}
          exclusive
          onChange={(_event, value) => {
            if (value) {
              setFileType(value);
            }
          }}
          color="primary"
          sx={{
            width: 1,
          }}>
          <StyledToggleButton value="json">JSON</StyledToggleButton>
          <StyledToggleButton value="csv">CSV</StyledToggleButton>
          {/* <StyledToggleButton value="xlsx">XLSX</StyledToggleButton> */}
        </ToggleButtonGroup>
        <Divider
          sx={{
            mt: 2,
            mb: 2,
          }}
        />
        <TextField
          value={publicApiToken ?? ""}
          slotProps={{
            input: {
              endAdornment: (
                <>
                  <IconButton
                    onClick={() => {
                      setShowPublicApiToken(!showPublicApiToken);
                    }}>
                    {showPublicApiToken ?
                      <VisibilityOff />
                    : <Visibility />}
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (publicApiToken) {
                        navigator.clipboard.writeText(publicApiToken);
                      }
                    }}>
                    <ContentCopy />
                  </IconButton>
                </>
              ),
            },
            inputLabel: {
              shrink: true,
            },
          }}
          type={showPublicApiToken ? "text" : "password"}
          disabled
          label="publicApiToken"
          variant="outlined"
          sx={(theme) => {
            return {
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: theme.palette.text.primary,
                color: theme.palette.text.primary,
              },
            };
          }}
        />
        <Divider
          sx={{
            mt: 2,
            mb: 2,
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={linkIncludesToken}
              onChange={(event) => {
                setLinkIncludesToken(event.currentTarget.checked);
              }}
            />
          }
          label="Include token in link"
        />
        <TextField
          value={getApiLink()}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  onClick={() => {
                    if (publicApiToken) {
                      navigator.clipboard.writeText(getApiLink());
                    }
                  }}>
                  <ContentCopy />
                </IconButton>
              ),
            },
          }}
          label="API Link"
          sx={{
            mb: 1,
          }}
        />
        {!linkIncludesToken && (
          <TextField
            value={"Bearer " + publicApiToken}
            slotProps={{
              input: {
                endAdornment: (
                  <>
                    <IconButton
                      onClick={() => {
                        setShowAuthorization(!showAuthorization);
                      }}>
                      {showAuthorization ?
                        <VisibilityOff />
                      : <Visibility />}
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        if (publicApiToken) {
                          navigator.clipboard.writeText(
                            "Bearer " + publicApiToken
                          );
                        }
                      }}>
                      <ContentCopy />
                    </IconButton>
                  </>
                ),
              },
            }}
            type={showAuthorization ? "text" : "password"}
            label='"Authorization" Header'
          />
        )}
        <Divider
          sx={{
            mt: 2,
            mb: 2,
          }}
        />
        <Button
          variant="outlined"
          onClick={async () => {
            const res = await (
              await fetch(getApiLink(), {
                headers: {
                  Authorization: "Bearer " + publicApiToken,
                },
              })
            ).text();
            console.log(res);

            const a = document.createElement("a");
            a.setAttribute(
              "href",
              URL.createObjectURL(
                new Blob([res], {
                  type: "text/plain",
                })
              )
            );
            a.setAttribute("download", dateFileName() + "." + fileType);
            a.setAttribute("target", "_blank");
            a.click();
          }}>
          Download File
        </Button>
        <Button
          variant="outlined"
          onClick={async () => {
            const res = await (
              await fetch(getApiLink(), {
                headers: {
                  Authorization: "Bearer " + publicApiToken,
                },
              })
            ).text();
            console.log(res);

            const a = document.createElement("a");
            a.setAttribute(
              "href",
              URL.createObjectURL(
                new Blob([res], {
                  type: "text/plain",
                })
              )
            );
            a.setAttribute("download", dateFileName() + ".txt");
            a.setAttribute("target", "_blank");
            a.click();
          }}>
          Download as TXT
        </Button>
      </Stack>
    </Stack>
  );
}

type DataTypeIconProps = {
  dataType: string;
};
function DataTypeIcon({ dataType }: DataTypeIconProps) {
  switch (dataType) {
    case "string": {
      return (
        <Tooltip
          title={<Typography>string</Typography>}
          arrow>
          <FormatQuote />
        </Tooltip>
      );
    }
    case "integer": {
      return (
        <Tooltip
          title={<Typography>integer</Typography>}
          arrow>
          <Numbers />
        </Tooltip>
      );
    }
    case "boolean": {
      return (
        <Tooltip
          title={<Typography>boolean (0 | 1)</Typography>}
          arrow>
          <Contrast />
        </Tooltip>
      );
    }
    case "error": {
      return (
        <Tooltip
          title={<Typography>invalid type (contact dev)</Typography>}
          arrow>
          <Error />
        </Tooltip>
      );
    }
    case "1 | 2 | 3":
    case "4": {
      return (
        <Tooltip
          title={<Typography>{dataType}</Typography>}
          arrow>
          <Numbers />
        </Tooltip>
      );
    }
    default: {
      return (
        <Tooltip
          title={<Typography>{dataType}</Typography>}
          arrow>
          <FormatQuote />
        </Tooltip>
      );
    }
  }
}
