import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Alert, AlertTitle, Box, Breadcrumbs, Button, Card, CardContent, Typography } from "@mui/material";

import NiCrossSquare from "@/icons/nexture/ni-cross-square";
import NiLaptop from "@/icons/nexture/ni-laptop";
import NiTablet from "@/icons/nexture/ni-tablet";
import { ApiError } from "@/services/api";
import { getSessionsApi, revokeSessionApi, type Session } from "@/services/userApi";

export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSessionsApi();
        setSessions(res.data);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
      }
    })();
  }, []);

  const revoke = async (id: string) => {
    try {
      await revokeSessionApi(id);
      setSessions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
  };

  return (
    <Box>
      <Box className="mb-6">
        <Typography variant="h1" component="h1" className="mb-0">
          Active Sessions
        </Typography>
        <Breadcrumbs>
          <Link color="inherit" to="/dashboards/default">
            Home
          </Link>
          <Link color="inherit" to="/settings">
            Settings
          </Link>
          <Typography variant="body2">Sessions</Typography>
        </Breadcrumbs>
      </Box>

      {error && (
        <Alert severity="error" icon={<NiCrossSquare />} className="mb-4">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Box className="flex flex-col gap-3">
        {sessions.map((session) => (
          <Card key={session._id}>
            <CardContent className="flex items-center justify-between">
              <Box className="flex items-center gap-3">
                {session.deviceInfo?.type === "mobile" ? (
                  <NiTablet size="large" className="text-text-secondary" />
                ) : (
                  <NiLaptop size="large" className="text-text-secondary" />
                )}
                <Box>
                  <Typography variant="subtitle1" className="font-semibold">
                    {session.deviceInfo?.name || session.deviceInfo?.browser || "Unknown Device"}
                  </Typography>
                  <Typography variant="body2" className="text-text-secondary">
                    {session.deviceInfo?.os || "Unknown OS"} • {session.ip || "Unknown IP"}
                    {session.location ? ` • ${session.location}` : ""}
                  </Typography>
                  <Typography variant="caption" className="text-text-secondary">
                    Last active: {session.lastActivity ? new Date(session.lastActivity).toLocaleString() : "N/A"}
                  </Typography>
                </Box>
              </Box>
              <Button variant="outlined" color="error" size="small" onClick={() => revoke(session._id)}>
                Revoke
              </Button>
            </CardContent>
          </Card>
        ))}

        {sessions.length === 0 && !error && (
          <Typography variant="body1" className="text-text-secondary text-center">
            No active sessions found.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
