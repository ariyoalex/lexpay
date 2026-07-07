import { Box, Chip, Paper, Typography } from "@mui/material";

import { type FundingMethod } from "@/services/paymentApi";

interface FundingMethodsProps {
  methods: FundingMethod[];
  selectedId?: string;
  onSelect?: (method: FundingMethod) => void;
}

export default function FundingMethods({ methods, selectedId, onSelect }: FundingMethodsProps) {
  if (methods.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No funding methods available
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {methods.map((method) => (
        <Paper
          key={method.id}
          onClick={() => onSelect?.(method)}
          sx={{
            p: 2.5,
            borderRadius: 2,
            cursor: onSelect ? "pointer" : "default",
            border: "2px solid",
            borderColor: selectedId === method.id ? "primary.main" : "transparent",
            bgcolor: selectedId === method.id ? "primary.50" : "background.paper",
            transition: "all 0.2s",
            "&:hover": onSelect ? { borderColor: "primary.light" } : {},
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="body1" fontWeight={600}>
                {method.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {method.description}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {!method.enabled && <Chip label="Coming Soon" size="small" color="warning" />}
              <Chip
                label={selectedId === method.id ? "Selected" : "Select"}
                size="small"
                color={selectedId === method.id ? "primary" : "default"}
                variant={selectedId === method.id ? "filled" : "outlined"}
              />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
