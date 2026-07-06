import { Grid, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import useChartPalette from "@/hooks/use-chart-palette";

const datasets = {
  Bump: [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
  Linear: [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
  "Linear Sharp": [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
  Pyramid: [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
  Step: [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
  "Step Pyramid": [{ value: 30 }, { value: 90 }, { value: 180 }, { value: 400 }],
};

const labels = ["Stage 1", "Stage 2", "Stage 3", "Stage 4"];

export default function Curve() {
  const chartPalette = useChartPalette();

  return (
    <Grid container spacing={4}>
      {Object.entries(datasets).map(([name, data]) => (
        <Grid key={name} size={6} className="flex flex-col items-center justify-center gap-2">
          <BarChart
            dataset={data.map((d, i) => ({ ...d, label: labels[i] }))}
            xAxis={[{ scaleType: "band", dataKey: "label" }]}
            series={[{ dataKey: "value" }]}
            height={300}
            {...chartPalette}
          />
          <Typography>{name}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
