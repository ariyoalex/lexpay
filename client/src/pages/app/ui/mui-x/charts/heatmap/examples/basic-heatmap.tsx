import { Box, Typography, useTheme } from "@mui/material";

import { cssVariableColorToRgb } from "@/lib/chart-helper";

const data: [number, number, number][] = [
  [0, 0, 10],
  [0, 1, 20],
  [0, 2, 40],
  [0, 3, 90],
  [0, 4, 70],
  [1, 0, 30],
  [1, 1, 50],
  [1, 2, 10],
  [1, 3, 70],
  [1, 4, 40],
  [2, 0, 50],
  [2, 1, 20],
  [2, 2, 90],
  [2, 3, 20],
  [2, 4, 70],
  [3, 0, 40],
  [3, 1, 50],
  [3, 2, 20],
  [3, 3, 70],
  [3, 4, 90],
];

const yLabels = ["A", "B", "C", "D", "E"];
const xLabels = [1, 2, 3, 4];

export default function BasicHeatmap() {
  const { palette } = useTheme();

  const minColor = cssVariableColorToRgb(palette.background.paper);
  const maxColor = cssVariableColorToRgb(palette.secondary.main);

  const maxVal = Math.max(...data.map((d) => d[2]));

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
  }

  return (
    <Box sx={{ display: "flex", gap: 1, p: 2 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px", mr: 0.5 }}>
        {yLabels.map((label) => (
          <Typography
            key={label}
            variant="caption"
            sx={{ height: 18, lineHeight: "18px", fontSize: 10, color: "text.secondary" }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box>
        <Box sx={{ display: "flex", gap: "2px", mb: 0.5 }}>
          {xLabels.map((label) => (
            <Typography
              key={label}
              variant="caption"
              sx={{ width: 18, textAlign: "center", fontSize: 10, color: "text.secondary" }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${xLabels.length}, 18px)`, gap: "2px" }}>
          {data.map(([x, y, value]) => {
            const intensity = maxVal > 0 ? value / maxVal : 0;
            return (
              <Box
                key={`${x}-${y}`}
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: "4px",
                  bgcolor: intensity > 0 ? `rgba(${hexToRgb(maxColor)}, ${0.2 + intensity * 0.8})` : minColor,
                }}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
