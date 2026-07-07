import { type ChangeEvent, useRef, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  onFileSelect: (file: File) => void;
  preview?: string;
  label?: string;
}

export default function FileUpload({
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  onFileSelect,
  preview,
  label,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSize) {
      setError(`File too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelect(file);
  };

  return (
    <Box className="flex flex-col items-center gap-2">
      <Box
        onClick={handleClick}
        className="border-grey-200 hover:bg-grey-50 flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full rounded-full object-cover" />
        ) : (
          <Typography variant="body2" className="text-text-secondary text-center">
            {label || "Click to upload"}
          </Typography>
        )}
      </Box>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      {error && (
        <Typography variant="caption" className="text-error">
          {error}
        </Typography>
      )}
      <Button size="small" variant="outlined" onClick={handleClick}>
        {previewUrl ? "Change" : "Upload"}
      </Button>
    </Box>
  );
}
