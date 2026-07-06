import { Box, Button, FormControl, InputLabel, Select, SelectProps } from "@mui/material";
import { useMovieData } from "../../../../../../../utils/mockData";
import { DataGrid } from "@mui/x-data-grid";

import NiArrowDown from "@/icons/nexture/ni-arrow-down";
import NiArrowInDown from "@/icons/nexture/ni-arrow-in-down";
import NiArrowUp from "@/icons/nexture/ni-arrow-up";
import NiBinEmpty from "@/icons/nexture/ni-bin-empty";
import NiCheck from "@/icons/nexture/ni-check";
import NiChevronDownSmall from "@/icons/nexture/ni-chevron-down-small";
import NiChevronLeftRightSmall from "@/icons/nexture/ni-chevron-left-right-small";
import NiChevronUpSmall from "@/icons/nexture/ni-chevron-up-small";
import NiCols from "@/icons/nexture/ni-cols";
import NiCross from "@/icons/nexture/ni-cross";
import NiEllipsisVertical from "@/icons/nexture/ni-ellipsis-vertical";
import NiEndDownSmall from "@/icons/nexture/ni-end-down-small";
import NiEndUpSmall from "@/icons/nexture/ni-end-up-small";
import NiEyeInactive from "@/icons/nexture/ni-eye-inactive";
import NiFilter from "@/icons/nexture/ni-filter";
import NiFilterPlus from "@/icons/nexture/ni-filter-plus";
import NiGroup from "@/icons/nexture/ni-group";
import NiPivot from "@/icons/nexture/ni-pivot";
import NiPlus from "@/icons/nexture/ni-plus";
import NiPushPinLeft from "@/icons/nexture/ni-push-pin-left";
import NiPushPinRight from "@/icons/nexture/ni-push-pin-right";
import NiSearch from "@/icons/nexture/ni-search";
import NiSum from "@/icons/nexture/ni-sum";
import NiUngroup from "@/icons/nexture/ni-ungroup";

export default function RowGroupingBasic() {
  const data = useMovieData();

  return (
    <Box className="h-100 w-full">
      <DataGrid
        {...data}
        disableRowSelectionOnClick
        className="border-none"
        slots={{
          columnSortedDescendingIcon: () => {
            return <NiArrowDown size={"small"}></NiArrowDown>;
          },
          columnSortedAscendingIcon: () => {
            return <NiArrowUp size={"small"}></NiArrowUp>;
          },
          columnFilteredIcon: () => {
            return <NiFilterPlus size={"small"}></NiFilterPlus>;
          },
          columnReorderIcon: () => {
            return <NiChevronLeftRightSmall size={"small"}></NiChevronLeftRightSmall>;
          },
          columnMenuIcon: () => {
            return <NiEllipsisVertical size={"small"}></NiEllipsisVertical>;
          },
          columnMenuSortAscendingIcon: NiArrowUp,
          columnMenuSortDescendingIcon: NiArrowDown,
          columnMenuFilterIcon: NiFilter,
          columnMenuHideIcon: NiEyeInactive,
          columnMenuClearIcon: NiCross,
          columnMenuManageColumnsIcon: NiCols,
          filterPanelDeleteIcon: NiCross,
          filterPanelAddIcon: NiPlus,
          filterPanelRemoveAllIcon: NiBinEmpty,
          columnSelectorIcon: NiCols,
          exportIcon: NiArrowInDown,
          openFilterButtonIcon: NiFilter,
          baseSelect: (props) => {
            const propsCasted = props as SelectProps;
            return (
              <FormControl size="small" variant="outlined">
                <InputLabel>{props.label}</InputLabel>
                <Select {...propsCasted} IconComponent={NiChevronDownSmall} MenuProps={{ className: "outlined" }} />
              </FormControl>
            );
          },
          quickFilterIcon: () => {
            return <NiSearch size={"medium"} />;
          },
          quickFilterClearIcon: () => {
            return <NiCross size={"medium"} />;
          },
          baseButton: (props) => {
            return <Button {...props} variant="pastel" color="grey"></Button>;
          },
        }}
      />
    </Box>
  );
}
