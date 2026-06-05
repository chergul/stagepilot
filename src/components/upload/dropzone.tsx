"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Image as ImageIcon, X, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DropzoneProps {
  onFileSelected: (file: File) => void
}

export function Dropzone({ onFileSelected }: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null)
      if (rejectedFiles && (rejectedFiles as { errors: { message: string }[] }[]).length > 0) {
        setError("Invalid file. Please upload a JPG, PNG or HEIC image under 20MB.")
        return
      }
      const file = acceptedFiles[0]
      if (!file) return
      setFileName(file.name)
      const url = URL.createObjectURL(file)
      setPreview(url)
      onFileSelected(file)
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/heic": [] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  })

  const handleRemove = () => {
    setPreview(null)
    setFileName(null)
    setError(null)
  }

  if (preview) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-zinc-200">
        <img src={preview} alt="Preview" className="w-full object-cover max-h-[500px]" />
        <div className="absolute top-3 right-3">
          <Button size="icon" variant="destructive" onClick={handleRemove} className="h-8 w-8 rounded-full shadow-lg">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          <ImageIcon className="mr-1.5 inline h-3.5 w-3.5" />
          {fileName}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-16 transition-colors",
          isDragActive
            ? "border-indigo-400 bg-indigo-50"
            : "border-zinc-300 bg-zinc-50 hover:border-indigo-300 hover:bg-indigo-50/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
          <Upload className="h-7 w-7 text-indigo-600" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-zinc-900">
            {isDragActive ? "Drop your image here" : "Drag & drop your photo here"}
          </p>
          <p className="mt-1 text-sm text-zinc-500">or click to browse — JPG, PNG, HEIC up to 20MB</p>
        </div>
      </div>
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}
