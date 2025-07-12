"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileError } from "react-dropzone";
import { useThumbnailStore } from "./store";
import { useRouter } from "next/navigation";

export default function Home() {
  const addThumbnails = useThumbnailStore((state) => state.addThumbnails);
  const thumbnails = useThumbnailStore((state) => state.thumbnails);
  const router = useRouter();
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadErrors([]); // Clear previous errors
    const newFiles = acceptedFiles.filter(
      (file) => !thumbnails.some((t) => t.file.name === file.name)
    );

    if (newFiles.length + thumbnails.length > 3) {
      setUploadErrors(["You can upload a maximum of 3 thumbnails."]);
      return;
    }
    
    addThumbnails(newFiles);

    if(newFiles.length > 0) {
      router.push('/testing');
    }

  }, [addThumbnails, thumbnails, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDropRejected: (fileRejections) => {
      const newErrors = fileRejections.map(({ file, errors }) => {
        const errorMessages = errors.map((e: FileError) => {
          if (e.code === 'file-too-large') {
            return `${file.name} is larger than 5MB`;
          }
          if (e.code === 'file-invalid-type') {
            return `${file.name} is not a valid image type (JPG, PNG)`;
          }
          return e.message;
        });
        return errorMessages;
      }).flat();
      setUploadErrors(prev => [...prev, ...newErrors]);
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 3,
  });

  const uploadedFileItems = thumbnails.map((thumbnail) => (
    <li key={thumbnail.file.name}>
      {thumbnail.file.name} - {(thumbnail.file.size / 1024).toFixed(2)} KB
    </li>
  ));


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
          Pick the Perfect Thumbnail
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          See your thumbnails in a real YouTube layout before you publish.
        </p>
      </div>

      <div className="mt-10 w-full max-w-xl">
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-50/25 px-6 py-10 ${
            isDragActive ? "bg-blue-100 dark:bg-blue-900/50" : ""
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
            <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
              <p className="pl-1">Upload up to 3 thumbnails</p>
            </div>
            <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
        {uploadErrors.length > 0 && (
          <div className="mt-4 text-red-500">
            <h4 className="font-bold">Upload Errors:</h4>
            <ul>
              {uploadErrors.map((error, i) => <li key={i}>{error}</li>)}
            </ul>
          </div>
        )}
        {thumbnails.length > 0 && (
          <aside className="mt-4">
            <h4 className="text-lg font-semibold">Uploaded Files:</h4>
            <ul>{uploadedFileItems}</ul>
          </aside>
        )}
      </div>
    </main>
  );
}
