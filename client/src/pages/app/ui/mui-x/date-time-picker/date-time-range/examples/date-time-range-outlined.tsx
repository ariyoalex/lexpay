import dayjs from "dayjs";

import { Box, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import NiCalendar from "@/icons/nexture/ni-calendar";
import NiChevronDownSmall from "@/icons/nexture/ni-chevron-down-small";
import NiChevronLeftSmall from "@/icons/nexture/ni-chevron-left-small";
import NiChevronRightSmall from "@/icons/nexture/ni-chevron-right-small";
import { cn } from "@/lib/utils";

export default function DateTimeRangeOutlined() {
  return (
    <Box className="flex flex-col">
      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiCalendar {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              switchViewIcon: (props) => {
                return <NiChevronDownSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              leftArrowIcon: (props) => {
                return <NiChevronLeftSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              rightArrowIcon: (props) => {
                return <NiChevronRightSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "outlined",
              },
              desktopPaper: { className: "outlined" },
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
            slots={{
              openPickerIcon: (props) => {
                return <NiCalendar {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              switchViewIcon: (props) => {
                return <NiChevronDownSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              leftArrowIcon: (props) => {
                return <NiChevronLeftSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              rightArrowIcon: (props) => {
                return <NiChevronRightSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                label: "Date",
              },
              desktopPaper: { className: "outlined" },
            }}
            readOnly
            defaultValue={dayjs("2025-04-17")}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disabled
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiCalendar {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              switchViewIcon: (props) => {
                return <NiChevronDownSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              leftArrowIcon: (props) => {
                return <NiChevronLeftSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              rightArrowIcon: (props) => {
                return <NiChevronRightSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                size: "small",
                variant: "outlined",
                label: "Disabled",
              },
              desktopPaper: { className: "outlined" },
            }}
            defaultValue={dayjs("2025-04-17")}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="outlined" size="medium">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Medium"
            className="mb-0"
            slots={{
              openPickerIcon: (props) => {
                return <NiCalendar {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              switchViewIcon: (props) => {
                return <NiChevronDownSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              leftArrowIcon: (props) => {
                return <NiChevronLeftSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              rightArrowIcon: (props) => {
                return <NiChevronRightSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                size: "medium",
                variant: "outlined",
                label: "Medium",
              },
              desktopPaper: { className: "outlined" },
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
                return <NiCalendar {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              switchViewIcon: (props) => {
                return <NiChevronDownSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              leftArrowIcon: (props) => {
                return <NiChevronLeftSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
              rightArrowIcon: (props) => {
                return <NiChevronRightSmall {...props} className={cn(props.className, "text-text-secondary")} />;
              },
            }}
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "outlined",
              },
              desktopPaper: { className: "outlined" },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl variant="outlined" fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: { size: "small", variant: "outlined", label: "Date" },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
