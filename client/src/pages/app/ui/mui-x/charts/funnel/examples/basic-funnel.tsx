import { BarChart } from "@mui/x-charts/BarChart";

import useChartPalette from "@/hooks/use-chart-palette";

export default function BasicFunnel() {
  const chartPalette = useChartPalette();

  const data = [
    { label: "A", value: 200 },
    { label: "B", value: 150 },
    { label: "C", value: 90 },
    { label: "D", value: 50 },
  ];

  return (
    <BarChart
      dataset={data}
      xAxis={[{ scaleType: "band", dataKey: "label" }]}
      series={[{ dataKey: "value" }]}
      height={300}
      width={450}
      {...chartPalette}
    />
  );
}
