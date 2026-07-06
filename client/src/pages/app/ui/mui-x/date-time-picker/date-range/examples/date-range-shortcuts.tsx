import dayjs, { Dayjs } from "dayjs";

import { Box, FormControl, FormLabel } from "@mui/material";
import { LocalizationProvider, PickersShortcutsItem } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";

import NiCalendar from "@/icons/nexture/ni-calendar";
import NiChevronDownSmall from "@/icons/nexture/ni-chevron-down-small";
import NiChevronLeftSmall from "@/icons/nexture/ni-chevron-left-small";
import NiChevronRightSmall from "@/icons/nexture/ni-chevron-right-small";
import { cn } from "@/lib/utils";

const shortcutsItems: PickersShortcutsItem<Dayjs | null>[] = [
  {
    label: "Today",
    getValue: () => {
      return dayjs();
    },
  },
  {
    label: "This Week",
    getValue: () => {
      const today = dayjs();
      return today;
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      return dayjs().subtract(7, "day");
    },
  },
  {
    label: "Current Month",
    getValue: () => {
      return dayjs();
    },
  },
  { label: "Reset", getValue: () => null },
];

export default function DateRangeShortcuts() {
  return (
    <Box className="flex flex-col items-start">
      <FormControl variant="standard" fullWidth className="outlined max-w-sm">
        <FormLabel component="label">Set</FormLabel>
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
              textField: { size: "small", variant: "standard" },
              desktopPaper: { className: "outlined" },
              shortcuts: {
                items: shortcutsItems,
                changeImportance: "set",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl variant="standard" fullWidth className="outlined mb-0 max-w-sm">
        <FormLabel component="label">Accept</FormLabel>
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
              textField: { size: "small", variant: "standard" },
              desktopPaper: { className: "outlined" },
              shortcuts: {
                items: shortcutsItems,
                changeImportance: "accept",
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}
