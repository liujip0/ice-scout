import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <Box
      sx={{
        bgcolor: "secondary.main",
        width: 1,
        height: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Typography
        variant="h1"
        sx={{
          textAlign: "center",
          color: "secondary.contrastText",
          mb: 4,
          fontSize: "2.5rem",
        }}>
        Indiana Scouting Alliance 2025
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
        <LinkButton to="/scout">Scout</LinkButton>
        <LinkButton to="/viewdata">View or Manage Data</LinkButton>
      </Box>
    </Box>
  );
}

type LinkButtonProps = {
  to: string;
  children: React.ReactNode;
};
function LinkButton({ to, children }: LinkButtonProps) {
  return (
    <Link to={to}>
      <Button
        variant="contained"
        sx={{
          width: 1,
        }}>
        {children}
      </Button>
    </Link>
  );
}
