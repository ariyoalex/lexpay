import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import { useNotifications } from "@/contexts/NotificationContext";
import NiBell from "@/icons/nexture/ni-bell";

export default function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, markAllRead, refresh } = useNotifications();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative" }}>
        <IconButton ref={anchorRef} onClick={() => setOpen((prev) => !prev)}>
          <Badge badgeContent={unreadCount} color="error">
            <NiBell />
          </Badge>
        </IconButton>

        {open && (
          <Paper
            sx={{
              position: "absolute",
              top: 44,
              right: 0,
              width: 360,
              maxHeight: 480,
              overflow: "auto",
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="subtitle2">Notifications</Typography>
              {unreadCount > 0 && (
                <Typography variant="caption" onClick={markAllRead} sx={{ cursor: "pointer", color: "primary.main" }}>
                  Mark all read
                </Typography>
              )}
            </Box>

            {notifications.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No notifications
              </Typography>
            ) : (
              <List dense>
                {notifications.map((n) => (
                  <ListItemButton
                    key={n._id}
                    onClick={() => {
                      if (!n.isRead) markRead(n._id);
                    }}
                    sx={{ bgcolor: n.isRead ? "transparent" : "action.hover" }}
                  >
                    <ListItemText
                      primary={n.title}
                      secondary={n.message}
                      primaryTypographyProps={{ variant: "body2", fontWeight: n.isRead ? 400 : 600 }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
            <Box sx={{ borderTop: "1px solid", borderColor: "divider", p: 1 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  setOpen(false);
                  navigate("/dashboards/notifications");
                }}
              >
                View all
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
