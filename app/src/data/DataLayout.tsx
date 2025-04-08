import { User } from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
} from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  borderMarginPx,
  borderWidthPx,
  GridBorder,
} from "../components/GridBorder.tsx";
import DataMenu from "./DataMenu.tsx";
import Export from "./export/Export.tsx";
import Users from "./users/Users.tsx";
import Util from "./Util.tsx";
import View from "./View.tsx";

type DataLayoutProps = {
  setToken: (
    newToken: string,
    expiresAt: number,
    permLevel: User["permLevel"]
  ) => void;
  permLevel: User["permLevel"];
};
export default function DataLayout({ setToken, permLevel }: DataLayoutProps) {
  const topBarHeightRem = 4;

  const navigate = useNavigate();
  const logoutFunction = () => {
    setToken("", 0, "none");
  };

  return (
    <Box
      sx={{
        width: 1,
        height: 1,
      }}>
      <AppBar
        color="primary"
        sx={{
          height: `${topBarHeightRem}rem`,
        }}>
        <Toolbar
          sx={{
            alignItems: "center",
            flex: 1,
          }}>
          <Avatar
            alt="ISA Logo"
            src="/logo.svg"
            sx={{
              borderColor: "primary.main",
              borderStyle: "solid",
              borderWidth: "2px",
              mr: 2,
            }}
            onClick={() => {
              navigate("/");
            }}
          />
          <Typography
            variant="h2"
            sx={{
              flex: 1,
              fontSize: {
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.6rem",
              },
            }}
            onClick={() => {
              navigate("/");
            }}>
            Indiana Scouting Alliance
          </Typography>
          <Button
            onClick={() => {
              if (window.location.pathname === "/data") {
                navigate("/");
              } else {
                navigate("/data");
              }
            }}
            variant="outlined"
            color="secondary"
            sx={{
              mr: 2,
            }}>
            Return
          </Button>
          <Button
            onClick={() => {
              logoutFunction();
            }}
            variant="outlined"
            color="secondary">
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: 1,
          height: `calc(calc(100% - ${topBarHeightRem}rem) + ${borderMarginPx + borderWidthPx}px)`,
          position: "relative",
          top: `calc(${topBarHeightRem}rem - ${borderMarginPx + borderWidthPx}px)`,
        }}>
        <GridBorder>
          <Routes>
            {["demo", "team", "datamanage", "admin"].includes(permLevel) && (
              <Route
                path="/"
                element={<DataMenu permLevel={permLevel} />}
              />
            )}
            {["demo", "team", "datamanage", "admin"].includes(permLevel) && (
              <Route
                path="view"
                element={<View logoutFunction={logoutFunction} />}
              />
            )}
            {["team", "datamanage", "admin"].includes(permLevel) && (
              <Route
                path="export/*"
                element={<Export />}
              />
            )}
            {["datamanage", "admin"].includes(permLevel) && (
              <Route
                path="review"
                element={<div>Review Data</div>}
              />
            )}
            {["admin"].includes(permLevel) && (
              <Route
                path="users"
                element={<Users logoutFunction={logoutFunction} />}
              />
            )}
            {["admin"].includes(permLevel) && (
              <Route
                path="util"
                element={<Util />}
              />
            )}
          </Routes>
        </GridBorder>
      </Box>
    </Box>
  );
}
