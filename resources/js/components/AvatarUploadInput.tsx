import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AvatarUploadInputProps {
  id?: string;
  onChange: (file: File | null) => void;
  previewUrl?: string;
  error?: string;
}

export function AvatarUploadInput({
  id = "avatar",
  onChange,
  previewUrl,
  error,
}: AvatarUploadInputProps) {
  return (
    <div>
        {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Avatar preview"
            className="w-24 h-24 rounded-md object-cover border"
          />
        </div>
      )}
      <Label htmlFor={id}>Avatar</Label>
      <Input
        id={id}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onChange(file);
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
