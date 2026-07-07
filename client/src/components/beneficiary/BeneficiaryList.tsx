import { Box, IconButton, Paper, Typography } from "@mui/material";

import NiStar from "@/icons/nexture/ni-star";
import NiTrash from "@/icons/nexture/ni-trash";
import { type Beneficiary } from "@/services/beneficiaryApi";

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDelete: (id: string) => void;
  onSelect?: (beneficiary: Beneficiary) => void;
}

export default function BeneficiaryList({ beneficiaries, onToggleFavorite, onDelete, onSelect }: BeneficiaryListProps) {
  if (beneficiaries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
        No beneficiaries yet. Add one to get started.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {beneficiaries.map((b) => (
        <Paper
          key={b._id}
          onClick={() => onSelect?.(b)}
          sx={{
            p: 2,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: onSelect ? "pointer" : "default",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight={600}>
              {b.name}
              {b.isFavorite && (
                <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                  ★
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {b.bank} &middot; {b.accountNumber}
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(b._id, !b.isFavorite);
              }}
              color={b.isFavorite ? "warning" : "default"}
            >
              <NiStar />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(b._id);
              }}
              color="error"
            >
              <NiTrash />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
