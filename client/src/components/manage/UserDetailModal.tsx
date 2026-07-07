import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Chip,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { getManageUserDetailApi, type ManageUser } from "@/services/manageApi";

interface Props {
  userId: string | null;
  onClose: () => void;
}

export default function UserDetailModal({ userId, onClose }: Props) {
  const [data, setData] = useState<{ user: ManageUser; wallet: any; recentTransactions: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDetail = useCallback(async (id: string) => {
    setLoading(true);
    setData(null);
    try {
      const res = await getManageUserDetailApi(id);
      setData(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) fetchDetail(userId);
  }, [userId, fetchDetail]);

  return (
    <Modal open={!!userId} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          maxHeight: "80vh",
          overflow: "auto",
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 4,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : !data ? (
          <Typography color="error">Failed to load</Typography>
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {data.user.firstName} {data.user.lastName}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
              <Typography variant="body2">Email: {data.user.email}</Typography>
              <Typography variant="body2">Phone: {data.user.phone}</Typography>
              <Typography variant="body2">
                Status:{" "}
                <Chip
                  label={data.user.isActive ? "Active" : "Suspended"}
                  color={data.user.isActive ? "success" : "error"}
                  size="small"
                />
              </Typography>
              <Typography variant="body2">
                Email Verified: {data.user.isEmailVerified ? "Yes" : "No"} | Phone Verified:{" "}
                {data.user.isPhoneVerified ? "Yes" : "No"}
              </Typography>
            </Box>

            {data.wallet && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2">Wallet</Typography>
                <Typography variant="body2">Balance: ₦{data.wallet.balance?.toLocaleString()}</Typography>
                <Typography variant="body2">Ledger: ₦{data.wallet.ledgerBalance?.toLocaleString()}</Typography>
                <Typography variant="body2">
                  Frozen:{" "}
                  <Chip
                    label={data.wallet.isFrozen ? "Yes" : "No"}
                    color={data.wallet.isFrozen ? "error" : "default"}
                    size="small"
                  />
                </Typography>
              </Paper>
            )}

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recent Transactions
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.recentTransactions.map((tx: any) => (
                  <TableRow key={tx._id}>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell align="right">₦{(tx.amount || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={tx.status} size="small" color={tx.status === "completed" ? "success" : "warning"} />
                    </TableCell>
                    <TableCell>{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ""}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Box>
    </Modal>
  );
}
