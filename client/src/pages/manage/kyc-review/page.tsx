import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { listPendingKycApi, type PendingKycItem, reviewKycApi } from "@/services/kycApi";

export default function Page() {
  const [items, setItems] = useState<PendingKycItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPendingKycApi();
      setItems(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedId) return;
    try {
      await reviewKycApi(selectedId, status, status === "rejected" ? rejectionReason : undefined);
      setSelectedId(null);
      setRejectionReason("");
      fetchPending();
    } catch {
      // ignore
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        KYC Review
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No pending KYC submissions</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>ID Type</TableCell>
                <TableCell>ID Number</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.userId.firstName} {item.userId.lastName}
                  </TableCell>
                  <TableCell>{item.userId.email}</TableCell>
                  <TableCell>{item.userId.phone}</TableCell>
                  <TableCell>{item.idType}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{item.idNumber}</TableCell>
                  <TableCell>{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : ""}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="primary" onClick={() => setSelectedId(item._id)}>
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!selectedId} onClose={() => setSelectedId(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Review KYC Submission</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Input
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Rejection reason (required if rejecting)"
              multiline
              minRows={2}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedId(null)}>Cancel</Button>
          <Button color="success" variant="contained" onClick={() => handleReview("approved")}>
            Approve
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleReview("rejected")}
            disabled={!rejectionReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
