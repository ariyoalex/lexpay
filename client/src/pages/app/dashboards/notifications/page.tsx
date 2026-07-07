import { Box, Button, List, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";

import { useNotifications } from "@/contexts/NotificationContext";

export default function Page() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <Box sx={{ maxWidth: 700, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Button size="small" onClick={markAllRead}>
            Mark all read ({unreadCount})
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">No notifications yet</Typography>
        </Paper>
      ) : (
        <Paper>
          <List disablePadding>
            {notifications.map((n) => (
              <ListItemButton
                key={n._id}
                divider
                onClick={() => {
                  if (!n.isRead) markRead(n._id);
                }}
                sx={{ bgcolor: n.isRead ? "transparent" : "action.hover" }}
              >
                <ListItemText
                  primary={n.title}
                  secondary={
                    <>
                      {n.message}
                      <br />
                      <Typography variant="caption" color="text.disabled">
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{ fontWeight: n.isRead ? 400 : 600 }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
