import { useState } from "react";

import { Box, Button, Input, MenuItem, Paper, Select, Typography } from "@mui/material";

import { broadcastNotificationApi } from "@/services/manageApi";

export default function Page() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "manage">("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: boolean; userCount: number } | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await broadcastNotificationApi(title, message, target);
      setResult(res.data);
      setTitle("");
      setMessage("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Broadcast Notification
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" fullWidth />
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification message"
            multiline
            minRows={3}
            fullWidth
          />
          <Select
            value={target}
            onChange={(e) => setTarget(e.target.value as "all" | "manage")}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Users</MenuItem>
            <MenuItem value="manage">Manage Users Only</MenuItem>
          </Select>
          <Button variant="contained" onClick={handleSend} disabled={sending || !title.trim() || !message.trim()}>
            {sending ? "Sending..." : "Send Broadcast"}
          </Button>
        </Box>

        {result && (
          <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
            Broadcast sent to {result.userCount} users
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
