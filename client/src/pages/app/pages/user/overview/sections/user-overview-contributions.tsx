import { useMemo } from "react";

import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

import { cssVariableColorToRgb } from "@/lib/chart-helper";

const data: [number, number, number][] = [
  [0, 0, 1],
  [1, 0, 0],
  [2, 0, 0],
  [3, 0, 0],
  [4, 0, 1],
  [5, 0, 0],
  [6, 0, 0],
  [7, 0, 2],
  [8, 0, 0],
  [9, 0, 0],
  [10, 0, 1],
  [11, 0, 0],
  [12, 0, 0],
  [13, 0, 0],
  [14, 0, 0],
  [15, 0, 2],
  [16, 0, 0],
  [17, 0, 0],
  [18, 0, 1],
  [19, 0, 0],
  [20, 0, 0],
  [21, 0, 0],
  [22, 0, 0],
  [23, 0, 0],
  [24, 0, 0],
  [25, 0, 1],
  [26, 0, 0],
  [27, 0, 0],
  [0, 1, 2],
  [1, 1, 1],
  [2, 1, 2],
  [3, 1, 1],
  [4, 1, 2],
  [5, 1, 3],
  [6, 1, 1],
  [7, 1, 1],
  [8, 1, 2],
  [9, 1, 1],
  [10, 1, 2],
  [11, 1, 1],
  [12, 1, 3],
  [13, 1, 1],
  [14, 1, 1],
  [15, 1, 2],
  [16, 1, 3],
  [17, 1, 2],
  [18, 1, 1],
  [19, 1, 2],
  [20, 1, 2],
  [21, 1, 1],
  [22, 1, 3],
  [23, 1, 2],
  [24, 1, 1],
  [25, 1, 2],
  [26, 1, 1],
  [27, 1, 3],
  [0, 2, 1],
  [1, 2, 2],
  [2, 2, 1],
  [3, 2, 2],
  [4, 2, 3],
  [5, 2, 1],
  [6, 2, 2],
  [7, 2, 3],
  [8, 2, 2],
  [9, 2, 2],
  [10, 2, 3],
  [11, 2, 2],
  [12, 2, 2],
  [13, 2, 1],
  [14, 2, 2],
  [15, 2, 2],
  [16, 2, 1],
  [17, 2, 2],
  [18, 2, 3],
  [19, 2, 1],
  [20, 2, 2],
  [21, 2, 2],
  [22, 2, 1],
  [23, 2, 3],
  [24, 2, 2],
  [25, 2, 2],
  [26, 2, 1],
  [27, 2, 2],
  [0, 3, 0],
  [1, 3, 1],
  [2, 3, 2],
  [3, 3, 0],
  [4, 3, 1],
  [5, 3, 0],
  [6, 3, 2],
  [7, 3, 2],
  [8, 3, 2],
  [9, 3, 3],
  [10, 3, 1],
  [11, 3, 2],
  [12, 3, 3],
  [13, 3, 1],
  [14, 3, 0],
  [15, 3, 2],
  [16, 3, 2],
  [17, 3, 2],
  [18, 3, 3],
  [19, 3, 2],
  [20, 3, 1],
  [21, 3, 0],
  [22, 3, 2],
  [23, 3, 1],
  [24, 3, 0],
  [25, 3, 1],
  [26, 3, 2],
  [27, 3, 3],
  [0, 4, 1],
  [1, 4, 2],
  [2, 4, 1],
  [3, 4, 2],
  [4, 4, 0],
  [5, 4, 1],
  [6, 4, 2],
  [7, 4, 2],
  [8, 4, 0],
  [9, 4, 1],
  [10, 4, 2],
  [11, 4, 3],
  [12, 4, 1],
  [13, 4, 2],
  [14, 4, 0],
  [15, 4, 1],
  [16, 4, 2],
  [17, 4, 1],
  [18, 4, 2],
  [19, 4, 2],
  [20, 4, 1],
  [21, 4, 3],
  [22, 4, 2],
  [23, 4, 1],
  [24, 4, 3],
  [25, 4, 0],
  [26, 4, 1],
  [27, 4, 2],
  [0, 5, 2],
  [1, 5, 1],
  [2, 5, 2],
  [3, 5, 3],
  [4, 5, 2],
  [5, 5, 1],
  [6, 5, 2],
  [7, 5, 2],
  [8, 5, 1],
  [9, 5, 2],
  [10, 5, 3],
  [11, 5, 2],
  [12, 5, 2],
  [13, 5, 1],
  [14, 5, 2],
  [15, 5, 3],
  [16, 5, 1],
  [17, 5, 2],
  [18, 5, 2],
  [19, 5, 1],
  [20, 5, 3],
  [21, 5, 1],
  [22, 5, 2],
  [23, 5, 3],
  [24, 5, 1],
  [25, 5, 2],
  [26, 5, 1],
  [27, 5, 3],
  [0, 6, 2],
  [1, 6, 0],
  [2, 6, 0],
  [3, 6, 0],
  [4, 6, 2],
  [5, 6, 0],
  [6, 6, 0],
  [7, 6, 0],
  [8, 6, 0],
  [9, 6, 0],
  [10, 6, 0],
  [11, 6, 2],
  [12, 6, 0],
  [13, 6, 0],
  [14, 6, 0],
  [15, 6, 2],
  [16, 6, 0],
  [17, 6, 0],
  [18, 6, 0],
  [19, 6, 1],
  [20, 6, 0],
  [21, 6, 0],
  [22, 6, 1],
  [23, 6, 0],
  [24, 6, 0],
  [25, 6, 2],
  [26, 6, 0],
  [27, 6, 2],
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function UserOverviewContributions() {
  const { palette } = useTheme();

  const minColor = cssVariableColorToRgb(palette.grey[25]);
  const maxColor = cssVariableColorToRgb(palette.primary.main);

  const maxVal = Math.max(...data.map((d) => d[2]));

  const grid = useMemo(() => {
    const cols = Math.max(...data.map((d) => d[0])) + 1;
    const cellSize = 18;
    const gap = 2;

    const gridData: { x: number; y: number; value: number; key: string }[] = data.map(([x, y, value]) => ({
      x,
      y,
      value,
      key: `${x}-${y}`,
    }));

    return { gridData, cols, cellSize, gap };
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h6" className="card-title">
          Contributions
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: `${grid.gap}px`, mr: 0.5 }}>
            {days.map((day) => (
              <Typography
                key={day}
                variant="caption"
                sx={{
                  height: `${grid.cellSize}px`,
                  lineHeight: `${grid.cellSize}px`,
                  fontSize: 10,
                  color: "text.secondary",
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid.cols}, ${grid.cellSize}px)`,
              gap: `${grid.gap}px`,
            }}
          >
            {grid.gridData.map(({ x, y, value, key }) => {
              const intensity = maxVal > 0 ? value / maxVal : 0;
              return (
                <Box
                  key={key}
                  sx={{
                    width: grid.cellSize,
                    height: grid.cellSize,
                    borderRadius: "4px",
                    bgcolor: intensity > 0 ? `rgba(${hexToRgb(maxColor)}, ${0.2 + intensity * 0.8})` : minColor,
                  }}
                />
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "0, 0, 0";
}
