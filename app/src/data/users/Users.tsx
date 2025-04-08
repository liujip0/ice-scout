import {
  User,
  UserColumn,
  UserColumns,
  UserPermLevel,
} from "@ice-scout/api/src/utils/dbtypes.ts";
import { Delete, Edit, FilterAltOff, Refresh } from "@mui/icons-material";
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { BorderedTable, Td, Th } from "../../components/Table.tsx";
import { trpc } from "../../utils/trpc.ts";
import CreateUser from "./CreateUser.tsx";
import EditUser from "./EditUser.tsx";

type UsersProps = {
  logoutFunction: () => void;
};
export default function Users({ logoutFunction }: UsersProps) {
  const users = trpc.users.users.useQuery(undefined, {
    retry: (_failureCount, error) => {
      if (error.data?.httpStatus === 401) {
        logoutFunction();
        return false;
      } else {
        return true;
      }
    },
  });

  const [searchUsername, setSearchUsername] = useState("");
  const [searchPermLevel, setSearchPermLevel] = useState<
    User["permLevel"] | ""
  >("");

  const [editUserOldUsername, setEditUserOldUsername] = useState<string | null>(
    null
  );
  const [editUserUsername, setEditUserUsername] = useState<string | null>(null);
  const [editUserPermLevel, setEditUserPermLevel] = useState<
    User["permLevel"] | undefined
  >(undefined);
  const [editUserTeamNumber, setEditUserTeamNumber] = useState<
    number | undefined
  >(undefined);
  const openEditUser = (username: string) => {
    setEditUserUsername(username);
    setEditUserOldUsername(username);
    setEditUserPermLevel(
      users.data?.find((user) => user.username === username)?.permLevel
    );
    setEditUserTeamNumber(
      users.data?.find((user) => user.username === username)?.teamNumber
    );
  };
  const closeEditUser = () => {
    setEditUserUsername(null);
    setEditUserOldUsername(null);
  };

  const [createUser, setCreateUser] = useState(false);

  return (
    <Stack
      gap={2}
      sx={{
        width: 1,
        height: 1,
        padding: 2,
      }}>
      <Paper
        sx={{
          display: "flex",
          gap: 2,
        }}
        square>
        <Stack
          direction="row"
          gap={2}
          sx={{
            flex: 1,
            overflowX: "scroll",
            padding: 1,
          }}>
          <TextField
            value={searchUsername}
            onChange={(event) => {
              setSearchUsername(event.currentTarget.value);
            }}
            label="username"
            size="small"
            sx={{
              width: 175,
            }}
          />
          <TextField
            value={searchPermLevel}
            onChange={(event) => {
              setSearchPermLevel(event.target.value as User["permLevel"] | "");
            }}
            select
            label="permLevel"
            size="small"
            sx={{
              width: 175,
            }}>
            <MenuItem value={""}>-</MenuItem>
            {UserPermLevel.map((perm) => (
              <MenuItem
                key={perm}
                value={perm}>
                {perm}
              </MenuItem>
            ))}
          </TextField>
          <Button
            onClick={() => {
              setCreateUser(true);
            }}
            variant="outlined">
            Create User
          </Button>
        </Stack>
        <IconButton
          onClick={() => {
            users.refetch();
          }}
          sx={{
            width: "max-content",
          }}>
          <Refresh />
        </IconButton>
        <IconButton
          onClick={() => {
            setSearchUsername("");
            setSearchPermLevel("");
          }}
          sx={{
            mr: 1,
            width: "max-content",
          }}>
          <FilterAltOff />
        </IconButton>
      </Paper>
      <TableContainer
        sx={{
          width: 1,
          height: 1,
        }}>
        <BorderedTable>
          <TableHead>
            <TableRow>
              {UserColumns.map((column) =>
                column !== "hashedPassword" ?
                  <Th key={column}>{column}</Th>
                : null
              )}
              <Th>Actions</Th>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.data?.map((user) => {
              if (searchUsername) {
                if (!user.username.includes(searchUsername)) {
                  return;
                }
              }
              if (searchPermLevel) {
                if (user.permLevel !== searchPermLevel) {
                  return;
                }
              }
              return (
                <TableRow key={user.username}>
                  {UserColumns.map((column) =>
                    column !== "hashedPassword" ?
                      <Td key={column}>
                        <Typography>{user[column as UserColumn]}</Typography>
                      </Td>
                    : null
                  )}
                  <Td>
                    <Stack
                      direction="row"
                      sx={{
                        width: 1,
                        height: 1,
                        justifyContent: "space-around",
                      }}>
                      <IconButton
                        onClick={() => {
                          openEditUser(user.username);
                        }}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton>
                        <Delete color="error" />
                      </IconButton>
                    </Stack>
                  </Td>
                </TableRow>
              );
            })}
          </TableBody>
        </BorderedTable>
      </TableContainer>
      <EditUser
        editUserUsername={editUserUsername}
        setEditUserUsername={setEditUserUsername}
        editUserOldUsername={editUserOldUsername}
        editUserPermLevel={editUserPermLevel}
        setEditUserPermLevel={setEditUserPermLevel}
        editUserTeamNumber={editUserTeamNumber}
        setEditUserTeamNumber={setEditUserTeamNumber}
        closeEditUser={closeEditUser}
        refreshUsers={() => {
          users.refetch();
        }}
      />
      <CreateUser
        createUser={createUser}
        setCreateUser={setCreateUser}
        refreshUsers={() => {
          users.refetch();
        }}
      />
    </Stack>
  );
}
