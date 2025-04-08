import { dateFileName } from "@ice-scout/api/src/utils/utils.ts";
import { Close, Download, FileUpload, Send } from "@mui/icons-material";
import { Button, IconButton, Snackbar, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { VisuallyHiddenInput } from "../components/VisuallyHiddenInput.tsx";
import { trpc } from "../utils/trpc.ts";

export default function Util() {
  const exportData = trpc.maintenance.exportData.useQuery();
  const [importDataString, setImportDataString] = useState("");
  const importData = trpc.maintenance.importData.useMutation();
  const [importDataStatus, setImportDataStatus] = useState("");

  return (
    <Stack
      sx={{
        padding: 4,
      }}
      gap={2}>
      <TextField
        value={JSON.stringify(exportData.data)}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                onClick={() => {
                  if (exportData.data) {
                    const a = document.createElement("a");
                    a.setAttribute(
                      "href",
                      URL.createObjectURL(
                        new Blob([JSON.stringify(exportData.data)], {
                          type: "application/json",
                        })
                      )
                    );
                    a.setAttribute("download", dateFileName() + ".json");
                    a.setAttribute("target", "_blank");
                    a.click();
                  }
                }}>
                <Download />
              </IconButton>
            ),
          },
          inputLabel: {
            shrink: true,
          },
        }}
        disabled
        label="Stringified Export Data"
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
      <TextField
        value={importDataString}
        onChange={(event) => {
          setImportDataString(event.currentTarget.value);
        }}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton
                onClick={() => {
                  importData.mutate(JSON.parse(importDataString));
                }}>
                <Send />
              </IconButton>
            ),
          },
        }}
        label="Stringified Import Data"
        variant="outlined"
      />
      <Button
        component="label"
        startIcon={<FileUpload />}>
        Upload JSON File
        <VisuallyHiddenInput
          type="file"
          accept="application/json"
          onChange={async (event) => {
            if (event.currentTarget.files) {
              const data = JSON.parse(
                await event.currentTarget.files[0].text()
              );
              importData.mutate(data);
            }
          }}
        />
      </Button>
      <Snackbar
        open={importDataStatus !== ""}
        autoHideDuration={3000}
        onClose={() => {
          setImportDataStatus("");
        }}
        message={status}
        action={
          <IconButton
            onClick={() => {
              setImportDataStatus("");
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
  );
}
