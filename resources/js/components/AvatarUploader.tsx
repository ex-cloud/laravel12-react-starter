"use client"

import { useEffect, forwardRef, useImperativeHandle } from "react"
import { AlertCircleIcon, ImageIcon, UploadIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"

export type AvatarUploaderHandle = {
  openFileDialog: () => void
  clearFile: () => void
}

type AvatarUploaderProps = {
  onFileChange: (file: File | null) => void
  maxSizeMB?: number
}

const AvatarUploader = forwardRef<AvatarUploaderHandle, AvatarUploaderProps>(
  ({ onFileChange, maxSizeMB = 2 }, ref) => {
    const maxSize = maxSizeMB * 1024 * 1024

    const [
      { files, isDragging, errors },
      {
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        openFileDialog,
        removeFile,
        getInputProps,
        inputRef,
      },
    ] = useFileUpload({
      accept: "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif",
      maxSize,
      multiple: false,
    })

    const inputProps = getInputProps({
      className: "sr-only",
      "aria-label": "Upload image file",
    })

    const previewUrl = files[0]?.preview || null

    useEffect(() => {
      console.log("Updated FILES:", files)
      const file = files.length > 0 ? files[0]?.file : null
      if (file instanceof File) {
        onFileChange(file)
      }
    }, [files, onFileChange])

    useImperativeHandle(ref, () => ({
      openFileDialog,
      clearFile: () => {
        if (files.length > 0) {
          files.forEach((f) => removeFile(f.id))
        }

        // Clear input value to allow re-upload same file if needed
        if (inputRef.current) {
          inputRef.current.value = ""
        }

        onFileChange(null)
      },
    }))

    return (
      <div className="flex flex-col gap-2">
        <div className="relative">
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            className="border-input data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
          >
            <input {...inputProps} ref={inputRef} />

            {previewUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <img
                  src={previewUrl}
                  alt="Uploaded preview"
                  className="mx-auto max-h-full rounded object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                <div className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border">
                  <ImageIcon className="size-4 opacity-60" />
                </div>
                <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                <p className="text-muted-foreground text-xs">
                  SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={openFileDialog}
                >
                  <UploadIcon className="-ms-1 size-4 opacity-60 mr-2" />
                  Select image
                </Button>
              </div>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <div
            className="text-destructive flex items-center gap-1 text-xs"
            role="alert"
          >
            <AlertCircleIcon className="size-3 shrink-0" />
            <span>{errors[0]}</span>
          </div>
        )}
      </div>
    )
  }
)

AvatarUploader.displayName = "AvatarUploader"
export default AvatarUploader
