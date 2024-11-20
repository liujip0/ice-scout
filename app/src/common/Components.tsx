import Box from "@mui/material/Box";

export const borderMarginPx = 20;
export const borderWidthPx = 5;

type GridBorderProps = {
  children: React.ReactNode;
};
export function GridBorder({ children }: GridBorderProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `${borderMarginPx}px 1fr ${borderMarginPx}px`,
        gridTemplateRows: `${borderMarginPx}px 1fr ${borderMarginPx}px`,
        columnGap: `${borderWidthPx}px`,
        rowGap: `${borderWidthPx}px`,
        width: 1,
        height: 1,
        backgroundColor: "primary.main",
      }}>
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 1,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 1,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 3,
          gridRow: 1,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 2,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 3,
          gridRow: 2,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 1,
          gridRow: 3,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 3,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 3,
          gridRow: 3,
          backgroundColor: "secondary.main",
        }}></Box>
      <Box
        sx={{
          gridColumn: 2,
          gridRow: 2,
          backgroundColor: "secondary.main",
        }}>
        {children}
      </Box>
    </Box>
  );
}
