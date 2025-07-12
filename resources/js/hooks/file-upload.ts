import { useRef, useState } from "react"
import { FileMetadata } from "./use-file-upload"

type FileUploadOptions = {
  accept?: string
  maxSize?: number
  multiple?: boolean
}

type FileWithPreview = {
    id: string
    file: File | FileMetadata
    preview: string
  }
  type FileUploadActions = {
    handleDragEnter: (event: React.DragEvent<HTMLDivElement>) => void
    handleDragLeave: (event: React.DragEvent<HTMLDivElement>) => void
    handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void
    handleDrop: (event: React.DragEvent<HTMLDivElement>) => void
    openFileDialog: () => void
    removeFile: (id: string) => void
    getInputProps: () => Omit<React.InputHTMLAttributes<HTMLInputElement>, "ref">
    inputRef: React.RefObject<HTMLInputElement | null>
  }

  type UseFileUploadResult = [
    {
      files: FileWithPreview[]
      isDragging: boolean
      errors: string[]
    },
    FileUploadActions
  ]

export function useFileUpload(options: FileUploadOptions = {}): UseFileUploadResult {
const inputRef = useRef<HTMLInputElement | null>(null)
const [files, setFiles] = useState<FileWithPreview[]>([])
const [isDragging, setIsDragging] = useState(false)
const [errors, setErrors] = useState<string[]>([])

const handleDragEnter = () => setIsDragging(true)
const handleDragLeave = () => setIsDragging(false)
const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
}

const validateFile = (file: File): string | null => {
    if (options.maxSize && file.size > options.maxSize) {
    return `File "${file.name}" terlalu besar. Max ${options.maxSize / 1024 / 1024}MB`
    }
    if (options.accept && !file.type.match(options.accept)) {
    return `File "${file.name}" bukan format yang didukung.`
    }
    return null
}

const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    setErrors([])

    const droppedFiles = Array.from(event.dataTransfer.files)
    const fileList = options.multiple ? droppedFiles : droppedFiles.slice(0, 1)

    const newFiles: FileWithPreview[] = []
    const newErrors: string[] = []

    for (const file of fileList) {
    const error = validateFile(file)
    if (error) {
        newErrors.push(error)
        continue
    }

    const id = `${file.name}-${file.size}-${Date.now()}`
    const preview = URL.createObjectURL(file)
    newFiles.push({ id, file, preview })
    }

    setFiles(newFiles)
    setErrors(newErrors)
}

const openFileDialog = () => {
    inputRef.current?.click()
}

const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : []
    const fileList = options.multiple ? selectedFiles : selectedFiles.slice(0, 1)

    const newFiles: FileWithPreview[] = []
    const newErrors: string[] = []

    for (const file of fileList) {
    const error = validateFile(file)
    if (error) {
        newErrors.push(error)
        continue
    }

    const id = `${file.name}-${file.size}-${Date.now()}`
    const preview = URL.createObjectURL(file)
    newFiles.push({ id, file, preview })
    }

    setFiles(newFiles)
    setErrors(newErrors)
}

const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
}

const getInputProps = (): React.InputHTMLAttributes<HTMLInputElement> => ({
    type: "file",
    accept: options.accept,
    multiple: options.multiple ?? false,
    onChange: handleInputChange,
})

return [
    {
    files,
    isDragging,
    errors,
    },
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
]
}
