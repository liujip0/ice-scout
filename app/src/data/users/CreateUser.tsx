import { MAX_TEAM_NUMBER } from "@ice-scout/api/src/utils/constants.ts";
import { User, UserPermLevel } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { trpc } from "../../utils/trpc.ts";

type CreateUserProps = {
  createUser: boolean;
  setCreateUser: (value: boolean) => void;
  refreshUsers: () => void;
};
export default function CreateUser({
  createUser: showCreateUser,
  setCreateUser,
  refreshUsers,
}: CreateUserProps) {
  const [createUserUsername, setCreateUserUsername] = useState("");
  const [createUserUsernameError, setCreateUserUsernameError] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserShowPassword, setCreateUserShowPassword] = useState(false);
  const [createUserPasswordError, setCreateUserPasswordError] = useState("");
  const [createUserPermLevel, setCreateUserPermLevel] =
    useState<User["permLevel"]>("team");
  const [createUserTeamNumber, setCreateUserTeamNumber] = useState<number>(0);
  const [createUserTeamNumberError, setCreateUserTeamNumberError] =
    useState("");
  const createUser = trpc.users.createUser.useMutation({
    onSuccess() {
      refreshUsers();
    },
  });

  return (
    <Dialog
      open={showCreateUser}
      onClose={() => {
        setCreateUser(false);
      }}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            pt: 2,
          }}
          gap={2}>
          <TextField
            value={createUserUsername}
            onChange={(event) => {
              setCreateUserUsername(event.currentTarget.value);
            }}
            label="Username"
            helperText={createUserUsernameError}
            error={createUserUsernameError !== ""}
          />
          <TextField
            value={createUserPassword}
            onChange={(event) => {
              setCreateUserPassword(event.currentTarget.value);
            }}
            label="Password"
            helperText={createUserPasswordError}
            error={createUserPasswordError !== ""}
            type={createUserShowPassword ? "text" : "password"}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    onClick={() => {
                      setCreateUserShowPassword(!createUserShowPassword);
                    }}>
                    {createUserShowPassword ?
                      <VisibilityOff />
                    : <Visibility />}
                  </IconButton>
                ),
              },
            }}
          />
          <TextField
            value={createUserPermLevel}
            onChange={(event) => {
              setCreateUserPermLevel(event.target.value as User["permLevel"]);
            }}
            select
            label="Permission Level">
            {UserPermLevel.map((perm) => (
              <MenuItem
                key={perm}
                value={perm}>
                {perm}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            value={isNaN(createUserTeamNumber) ? "" : createUserTeamNumber}
            onChange={(event) => {
              setCreateUserTeamNumber(parseInt(event.currentTarget.value));
            }}
            label="Team Number"
            helperText={createUserTeamNumberError}
            error={createUserTeamNumberError !== ""}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setCreateUser(false);
          }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            let error = false;

            if (!createUserUsername) {
              setCreateUserUsernameError("Cannot be empty");
              error = true;
            } else {
              setCreateUserUsernameError("");
            }

            if (!createUserPassword) {
              setCreateUserPasswordError("Cannot be empty");
              error = true;
            } else {
              setCreateUserPasswordError("");
            }

            if (
              isNaN(createUserTeamNumber) ||
              createUserTeamNumber < 0 ||
              createUserTeamNumber > MAX_TEAM_NUMBER
            ) {
              setCreateUserTeamNumberError("Invalid team number");
              error = true;
            } else {
              setCreateUserTeamNumberError("");
            }

            if (!error) {
              createUser.mutate({
                username: createUserUsername,
                password: createUserPassword,
                permLevel: createUserPermLevel,
                teamNumber: createUserTeamNumber,
              });
              setCreateUser(false);
            }
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
