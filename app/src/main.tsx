import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { trpc } from "./utils/trpc.ts";

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#000f5d", // Indiana Flag Blue
        contrastText: "#fff",
      },
      secondary: {
        main: "#ffb900", // Indiana Flag Gold
        contrastText: "#000",
      },
      background: {
        default: "#89cff0", // Light Indiana Flag Gold
        paper: "#dddddd",
      },
    },
    typography: {
      h1: {
        fontSize: "5rem",
      },
      h2: {
        fontSize: "2rem",
      },
      body1: {
        fontSize: "1.5em",
      },
      button: {
        fontSize: "1.3em",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "#000f5d",
          },
        },
      },
    },
  })
);

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL + "/api",
      headers() {
        return {
          Authorization: "Bearer " + localStorage.getItem("token"),
        };
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </ThemeProvider>
);