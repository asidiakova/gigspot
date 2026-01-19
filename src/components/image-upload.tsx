"use client";

import React, { useRef, useState } from "react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface ImageUploadProps {
  endpoint: "profileImage" | "eventFlyer";
  value?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
}

export function ImageUpload({
  endpoint,
  value,
  onUploadComplete,
  onRemove,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]?.ufsUrl) {
        onUploadComplete(res[0].ufsUrl);
        toast.success("Image uploaded");
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast.error(error.message || "Upload failed");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    void startUpload([file]);
    e.target.value = "";
  };

  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <Button
        type="button"
        variant="secondary"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            {value ? "Change Image" : "Select Image"}
          </>
        )}
      </Button>
      {value && onRemove && (
        <Button type="button" variant="outline" onClick={onRemove}>
          <X className="h-4 w-4" />
          Remove
        </Button>
      )}
    </div>
  );
}
