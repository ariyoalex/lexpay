import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Chip,
  Input,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { type AuditLog, getAuditLogsApi } from "@/services/manageApi";

export default function Page() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [severity, setSeverity] = useState("");
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAuditLogsApi(severity || undefined, action || undefined);
      setLogs(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [severity, action]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const severityColor = (s: string) => {
    switch (s) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Audit Logs
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          displayEmpty
          size="small"
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">All Severities</MenuItem>
          <MenuItem value="info">Info</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
        </Select>
        <Input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Filter by action..."
          sx={{ minWidth: 220 }}
        />
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{log.action}</TableCell>
                  <TableCell>{log.resource}</TableCell>
                  <TableCell>{log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : "—"}</TableCell>
                  <TableCell>
                    <Chip label={log.severity} size="small" color={severityColor(log.severity) as any} />
                  </TableCell>
                  <TableCell>{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
