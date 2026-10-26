"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "@boxicons/react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  currentImageUrl?: string | null;
};

const maxFileSize = 5 * 1024 * 1024;

export function ImageUpload({ currentImageUrl = null }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const displayedImage = preview ?? currentImageUrl;

  function chooseFile(file?: File) {
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file to continue.");
      restoreInputSelection();
      return;
    }
    if (file.size > maxFileSize) {
      setError("Image must be 5 MB or smaller.");
      restoreInputSelection();
      return;
    }

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const objectUrl = URL.createObjectURL(file);
    previewRef.current = objectUrl;
    setPreview(objectUrl);
    setSelectedFile(file);
    if (inputRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(file);
      inputRef.current.files = transfer.files;
    }
  }

  function restoreInputSelection() {
    if (!inputRef.current) return;
    if (!selectedFile) {
      inputRef.current.value = "";
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(selectedFile);
    inputRef.current.files = transfer.files;
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
  }

  function handleRemove() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = null;
    setPreview(null);
    setSelectedFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="w-full max-w-2xl rounded-xl border border-[var(--admin-line)] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="size-24 overflow-hidden rounded-full border-4 border-white bg-indigo-50 shadow-[0_0_0_1px_var(--admin-line),0_4px_14px_rgb(24_24_27/0.08)] sm:size-28">
            {displayedImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayedImage}
                alt="Profile image preview"
                className="size-full object-cover"
              />
            ) : (
              <div
                className="grid size-full place-items-center text-indigo-400"
                role="img"
                aria-label="No profile image selected"
              >
                <User aria-hidden="true" />
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h3 className="text-sm font-semibold text-zinc-900">Profile photo</h3>
            {selectedFile && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                Ready to save
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            {selectedFile
              ? "Preview your new photo below. It will be uploaded when you save the profile."
              : currentImageUrl
                ? "Your photo appears on your public portfolio profile."
                : "Add a photo so visitors can put a face to your portfolio."}
          </p>

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`mt-3 flex flex-col items-center gap-2 rounded-lg border border-dashed px-3 py-3 transition sm:flex-row sm:justify-between ${
              isDragging
                ? "border-[var(--accent)] bg-indigo-50"
                : "border-zinc-200 bg-zinc-50/70"
            }`}
          >
            <div className="min-w-0 text-center sm:text-left">
              <p className="truncate text-xs font-medium text-zinc-700">
                {selectedFile ? selectedFile.name : "Choose a photo"}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-500">
                PNG, JPG, WEBP or GIF · up to 5 MB
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus />
                {selectedFile || currentImageUrl ? "Change photo" : "Browse files"}
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleRemove}
                  aria-label="Discard selected photo"
                  title="Discard selected photo"
                >
                  <X />
                </Button>
              )}
            </div>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
      />
    </section>
  );
}
