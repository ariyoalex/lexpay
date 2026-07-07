import { type KeyboardEvent, useRef } from "react";

import { Box, Input } from "@mui/material";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function PinInput({ length = 4, value, onChange, error, disabled }: PinInputProps) {
  const inputsRef = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return;
    const newVal = value.split("");
    newVal[index] = char;
    const joined = newVal.join("").slice(0, length);
    onChange(joined);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
      {Array.from({ length }, (_, i) => (
        <Input
          key={i}
          inputRef={(el) => {
            inputsRef.current[i] = el;
          }}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          error={error}
          disabled={disabled}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "1.5rem",
              width: 48,
              height: 56,
              padding: 0,
            },
          }}
          sx={{
            "& .MuiInput-input": {
              textAlign: "center",
              fontSize: "1.5rem",
              width: 48,
              height: 56,
              padding: 0,
              border: "2px solid",
              borderColor: error ? "error.main" : "divider",
              borderRadius: 2,
              "&:focus": { borderColor: "primary.main", outline: "none" },
            },
          }}
        />
      ))}
    </Box>
  );
}
