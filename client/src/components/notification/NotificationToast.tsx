import { useCallback, useRef, useState } from "react";

import { Alert, Snackbar } from "@mui/material";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
}

export function useNotificationToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const processedRef = useRef<string | null>(null);

  const showToast = useCallback((msg: ToastMessage) => {
    if (msg.id !== processedRef.current) {
      processedRef.current = msg.id;
      setToast(msg);
    }
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}

export default function NotificationToast({ toast, onClose }: { toast: ToastMessage | null; onClose: () => void }) {
  return (
    <Snackbar
      open={!!toast}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity="info" variant="filled" sx={{ width: "100%" }}>
        {toast?.title && <strong>{toast.title}</strong>}
        {toast?.title && toast?.message ? ": " : ""}
        {toast?.message}
      </Alert>
    </Snackbar>
  );
}
