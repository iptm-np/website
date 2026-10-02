import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, Loader2 } from "lucide-react";

import { uploadImage } from "../../../cloudinary";
import { Label } from "./label";
import { Button } from "./button";

// Maximum accepted image size: 5 MB, enforced before upload.
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

type ImageUploadProps = {
  label?: string;
  value?: string;
  folder?: string;
  disabled?: boolean;
  onChange: (url: string) => void;
};

export function ImageUpload({
  label = "Image",
  value,
  folder = "uploads",
  disabled,
  onChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error("Maximum file size is 5MB");
      return;
    }

    try {
      setUploading(true);
      setFileName(file.name);

      const url = await uploadImage(file, folder);

      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
      setFileName("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <label
        className={`
          flex cursor-pointer flex-col items-center justify-center
          rounded-xl border-2 border-dashed p-6 text-center
          transition-colors
          ${
            disabled || uploading
              ? "cursor-not-allowed opacity-60"
              : "hover:border-primary hover:bg-muted/40"
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleUpload}
        />

        {uploading ? (
          <>
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Uploading image...</p>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Click to upload an image</p>
          </>
        )}
      </label>

      {value && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={disabled || uploading}
          onClick={() => onChange("")}
        >
          <X className="mr-2 h-4 w-4" />
          Remove Image
        </Button>
      )}
    </div>
  );
}

/**
 * Multi-file variant of ImageUpload. Uploads every selected image (sequentially,
 * with a progress counter) and reports all new URLs back in a single onChange.
 */
export function MultiImageUpload({
  label = "Images",
  folder = "uploads",
  disabled,
  onChange,
}: {
  label?: string;
  folder?: string;
  disabled?: boolean;
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same files later

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("Please select image files");
      return;
    }

    const valid = imageFiles.filter((f) => f.size <= MAX_IMAGE_SIZE_BYTES);
    const skipped = imageFiles.length - valid.length;
    if (skipped > 0) {
      toast.error(
        `${skipped} file${skipped === 1 ? "" : "s"} exceeded the 5MB limit and were skipped`
      );
    }
    if (valid.length === 0) return;

    try {
      setUploading(true);
      setProgress({ done: 0, total: valid.length });

      const urls: string[] = [];
      for (const [i, file] of valid.entries()) {
        urls.push(await uploadImage(file, folder));
        setProgress({ done: i + 1, total: valid.length });
      }

      onChange(urls);
      toast.success(
        `${urls.length} image${urls.length === 1 ? "" : "s"} uploaded`
      );
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <label
        className={`
          flex cursor-pointer flex-col items-center justify-center
          rounded-xl border-2 border-dashed p-6 text-center
          transition-colors
          ${
            disabled || uploading
              ? "cursor-not-allowed opacity-60"
              : "hover:border-primary hover:bg-muted/40"
          }
        `}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled || uploading}
          onChange={handleUpload}
        />

        {uploading ? (
          <>
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="font-medium">Uploading images...</p>
            <p className="text-sm text-muted-foreground">
              {progress.done} of {progress.total} uploaded
            </p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Click to upload images</p>
            <p className="text-sm text-muted-foreground">
              Select multiple photos at once (max 5MB each)
            </p>
          </>
        )}
      </label>
    </div>
  );
}
