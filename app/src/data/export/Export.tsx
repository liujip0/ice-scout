import { TeamMatchEntryColumns } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Link, Route, Routes, useResolvedPath } from "react-router-dom";
import { trpc } from "../../utils/trpc.ts";
import ExportLayout from "./ExportLayout.tsx";

export default function Export() {
  const [showPublicApiToken, setShowPublicApiToken] = useState(false);
  const [linkIncludesToken, setLinkIncludesToken] = useState(false);
  const [showAuthorization, setShowAuthorization] = useState(false);

  const [events, setEvents] = useState("");
  const [teams, setTeams] = useState("");

  const resolvedPath = useResolvedPath("");
  const pathend = resolvedPath.pathname.split("/").pop();

  const publicApiToken = trpc.users.publicApiToken.useQuery();

  const [robotColumns, setRobotColumns] = useState<boolean[]>(
    new Array(TeamMatchEntryColumns.length)
      .fill(false)
      .map(
        (_, i) =>
          ![
            "deviceTeamNumber",
            "deviceId",
            "scoutName",
            "scoutTeamNumber",
            "eventKey",
            "matchLevel",
            "alliance",
            "robotNumber",
            "dataConfidence",
          ].includes(TeamMatchEntryColumns[i])
      )
  );

  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        padding: 2,
      }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}>
        <Tabs value={pathend === "" ? "/" : pathend}>
          <Tab
            label="Robot Data"
            value="robots"
            component={Link}
            to={
              resolvedPath.pathname.split("/").slice(0, -1).join("/") +
              "/robots"
            }
          />
        </Tabs>
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "scroll",
        }}>
        <Routes>
          <Route
            path="robots"
            element={
              <ExportLayout
                showPublicApiToken={showPublicApiToken}
                setShowPublicApiToken={setShowPublicApiToken}
                linkIncludesToken={linkIncludesToken}
                setLinkIncludesToken={setLinkIncludesToken}
                showAuthorization={showAuthorization}
                setShowAuthorization={setShowAuthorization}
                publicApiToken={publicApiToken.data}
                robotColumnsState={robotColumns}
                setRobotColumnsState={setRobotColumns}
                linkBase="/public/robots/"
                events={events}
                setEvents={setEvents}
                teams={teams}
                setTeams={setTeams}
              />
            }
          />
        </Routes>
      </Box>
    </Stack>
  );
}
