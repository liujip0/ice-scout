import { MAX_TEAM_NUMBER } from "@ice-scout/api/src/utils/constants.ts";
import { User, UserPermLevel } from "@ice-scout/api/src/utils/dbtypes.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { trpc } from "../../utils/trpc.ts";

type EditUserProps = {
  editUserUsername: string | null;
  setEditUserUsername: (value: string | null) => void;
  editUserOldUsername: string | null;
  editUserPermLevel: User["permLevel"] | undefined;
  setEditUserPermLevel: (value: User["permLevel"] | undefined) => void;
  editUserTeamNumber: number | undefined;
  setEditUserTeamNumber: (value: number | undefined) => void;
  closeEditUser: () => void;
  refreshUsers: () => void;
};
export default function EditUser({
  editUserUsername,
  setEditUserUsername,
  editUserOldUsername,
  editUserPermLevel,
  setEditUserPermLevel,
  editUserTeamNumber,
  setEditUserTeamNumber,
  closeEditUser,
  refreshUsers,
}: EditUserProps) {
  const editUser = trpc.users.editUser.useMutation({
    onSuccess() {
      refreshUsers();
    },
  });
  const [editUserUsernameError, setEditUserUsernameError] = useState("");
  const [editUserPassword, setEditUserPassword] = useState("");
  const [editUserTeamNumberError, setEditUserTeamNumberError] = useState("");

  return (
    <Dialog
      open={editUserUsername !== null}
      onClose={() => {
        closeEditUser();
      }}>
      <DialogTitle>Manage User</DialogTitle>
      <DialogContent>
        <Stack
          sx={{
            pt: 2,
          }}
          gap={2}>
          <TextField
            value={editUserUsername}
            onChange={(event) => {
              setEditUserUsername(event.currentTarget.value);
            }}
            label="Username"
            helperText={editUserUsernameError}
            error={editUserUsernameError !== ""}
          />
          <TextField
            value={editUserPermLevel}
            onChange={(event) => {
              setEditUserPermLevel(event.target.value as User["permLevel"]);
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
            value={
              editUserTeamNumber === undefined || isNaN(editUserTeamNumber) ?
                ""
              : editUserTeamNumber
            }
            onChange={(event) => {
              setEditUserTeamNumber(parseInt(event.currentTarget.value));
            }}
            label="Team Number"
            helperText={editUserTeamNumberError}
            error={editUserTeamNumberError !== ""}
          />
          <TextField
            value={editUserPassword}
            onChange={(event) => {
              setEditUserPassword(event.currentTarget.value);
            }}
            label="Password"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            closeEditUser();
          }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            let error = false;

            if (!editUserUsername) {
              setEditUserUsernameError("Cannot be empty");
              error = true;
            } else {
              setEditUserUsernameError("");
            }

            if (
              editUserTeamNumber === undefined ||
              isNaN(editUserTeamNumber) ||
              editUserTeamNumber < 0 ||
              editUserTeamNumber > MAX_TEAM_NUMBER
            ) {
              setEditUserTeamNumberError("Invalid team number");
              error = true;
            } else {
              setEditUserTeamNumberError("");
            }

            if (!error) {
              editUser.mutate({
                oldUsername: editUserOldUsername!,
                newUsername: editUserUsername!,
                permLevel: editUserPermLevel!,
                password: editUserPassword ? editUserPassword : undefined,
                teamNumber: editUserTeamNumber!,
              });
              closeEditUser();
            }
          }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
