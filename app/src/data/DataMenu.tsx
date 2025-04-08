import { User } from "@ice-scout/api/src/utils/dbtypes.ts";
import { Stack } from "@mui/material";
import { LinkButton } from "../components/LinkButton.tsx";

type DataMenuProps = {
  permLevel: User["permLevel"];
};
export default function DataMenu({ permLevel }: DataMenuProps) {
  return (
    <Stack
      sx={{
        width: 1,
        height: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Stack gap={2}>
        {
          //TODO: uncomment when data viewer actually works well
          // ["demo", "team", "datamanage", "admin"].includes(permLevel) && (
          //   <LinkButton
          //     to="/data/view"
          //     color="primary">
          //     View Data
          //   </LinkButton>
          // )
        }
        {["team", "datamanage", "admin"].includes(permLevel) && (
          <LinkButton
            to="/data/export/robots"
            color="primary">
            Export Data
          </LinkButton>
        )}
        {["datamanage", "admin"].includes(permLevel) && (
          <LinkButton
            to="/data/review"
            color="primary">
            Review Data
          </LinkButton>
        )}
        {["admin"].includes(permLevel) && (
          <LinkButton
            to="/data/users"
            color="primary">
            Manage Users
          </LinkButton>
        )}
        {["admin"].includes(permLevel) && (
          <LinkButton
            to="/data/util"
            color="primary">
            Util
          </LinkButton>
        )}
      </Stack>
    </Stack>
  );
}
