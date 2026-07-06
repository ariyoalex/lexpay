import dayjs from "dayjs";

import { Box, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import NiClock from "@/icons/nexture/ni-clock";
import { cn } from "@/lib/utils";

export default function TimeRangeOutlined() {
  return (
    <Box>
      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiClock {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Small",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined" className="mb-0">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            defaultValue={dayjs("2025-04-17T15:30")}
            readOnly
            slots={{
              openPickerIcon: (props) => {
                return <NiClock {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Readonly",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            defaultValue={dayjs("2025-04-17T15:30")}
            disabled
            slots={{
              openPickerIcon: (props) => {
                return <NiClock {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Disabled",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiClock {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Medium",
                size: "medium",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiClock {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "outlined",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
