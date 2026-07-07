import { Box, FormControl, Input, MenuItem, Select } from "@mui/material";

import { type TransactionFilters } from "@/services/transactionApi";

interface TransactionFilterProps {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

export default function TransactionFilter({ filters, onChange }: TransactionFilterProps) {
  const update = (patch: Partial<TransactionFilters>) => onChange({ ...filters, ...patch });

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <Select value={filters.type || ""} onChange={(e) => update({ type: e.target.value || undefined })} displayEmpty>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="funding">Funding</MenuItem>
          <MenuItem value="transfer_in">Transfer In</MenuItem>
          <MenuItem value="transfer_out">Transfer Out</MenuItem>
          <MenuItem value="withdrawal">Withdrawal</MenuItem>
          <MenuItem value="bill_payment">Bill Payment</MenuItem>
          <MenuItem value="credit">Credit</MenuItem>
          <MenuItem value="debit">Debit</MenuItem>
          <MenuItem value="fee">Fee</MenuItem>
          <MenuItem value="reversal">Reversal</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={filters.status || ""}
          onChange={(e) => update({ status: e.target.value || undefined })}
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="failed">Failed</MenuItem>
          <MenuItem value="reversed">Reversed</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Input
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => update({ startDate: e.target.value || undefined })}
          placeholder="Start Date"
        />
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Input
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => update({ endDate: e.target.value || undefined })}
          placeholder="End Date"
        />
      </FormControl>
    </Box>
  );
}
