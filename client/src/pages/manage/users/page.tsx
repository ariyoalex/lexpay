import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Chip,
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

import UserDetailModal from "@/components/manage/UserDetailModal";
import { listManageUsersApi, type ManageUser, toggleUserStatusApi } from "@/services/manageApi";

export default function Page() {
  const [users, setUsers] = useState<ManageUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listManageUsersApi(search || undefined);
      setUsers(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatusApi(userId);
      fetchUsers();
    } catch {
      // ignore
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        User Management
      </Typography>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or phone..."
        sx={{ mb: 3, width: 360 }}
      />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} hover sx={{ cursor: "pointer" }} onClick={() => setSelectedUserId(u._id)}>
                  <TableCell>
                    {u.firstName} {u.lastName}
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.isActive ? "Active" : "Suspended"}
                      color={u.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{u.isEmailVerified && u.isPhoneVerified ? "Full" : "Partial"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={u.isActive ? "error" : "success"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(u._id);
                      }}
                    >
                      {u.isActive ? "Suspend" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </Box>
  );
}
