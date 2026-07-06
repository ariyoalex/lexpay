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

export default function DateTimeRangeFilled() {
  return (
    <Box className="flex flex-col">
      <FormControl fullWidth variant="filled">
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
                variant: "filled",
              },
              desktopPaper: { className: "outlined" },
            }}
          />
        </LocalizationProvider>
      </FormControl>
      <FormControl fullWidth variant="filled" className="mb-0">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="mb-0"
            slotProps={{
              textField: {
                label: "Date",
                size: "small",
                variant: "filled",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
      <FormControl fullWidth variant="filled">
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
                label: "Readonly",
                size: "small",
                variant: "filled",
              },
              desktopPaper: { className: "outlined" },
            }}
            readOnly
            defaultValue={dayjs("2025-04-17")}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="filled">
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
                label: "Disabled",
                size: "small",
                variant: "filled",
              },
              desktopPaper: { className: "outlined" },
            }}
            defaultValue={dayjs("2025-04-17")}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="filled" size="medium">
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
                label: "Medium",
                size: "medium",
                variant: "filled",
              },
              desktopPaper: { className: "outlined" },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl fullWidth variant="filled">
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
                variant: "filled",
              },
              desktopPaper: { className: "outlined" },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl variant="filled" fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{
              textField: { size: "small", variant: "filled", label: "Date" },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
