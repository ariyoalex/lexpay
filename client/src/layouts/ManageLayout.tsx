import { Outlet, useNavigate } from "react-router-dom";

import { Box, Button, Paper, Typography } from "@mui/material";

import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/manage/dashboard" },
  { label: "Users", path: "/manage/users" },
  { label: "Transactions", path: "/manage/transactions" },
  { label: "Analytics", path: "/manage/analytics" },
  { label: "Audit Logs", path: "/manage/audit-logs" },
  { label: "Broadcast", path: "/manage/broadcast" },
];

export default function ManageLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <Paper
        sx={{
          width: 240,
          borderRadius: 0,
          p: 2,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, px: 1 }}>
          LexPay Manage
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{ justifyContent: "flex-start", textTransform: "none", px: 2 }}
              variant="text"
              color="inherit"
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ px: 1, mb: 1 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Button size="small" onClick={logout} color="error" sx={{ textTransform: "none" }}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Box sx={{ flex: 1, p: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
