import React, { useCallback, useState } from "react";
import { Upload, File, AlertCircle, X } from "lucide-react";

export interface CodeFile {
  name: string;
  content: string;
  type: string;
}

interface FileUploadProps {
  onFileUpload: (files: CodeFile[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  multiple = false,
  maxFiles = 10,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const supportedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".php",
    ".rb",
    ".go",
    ".rs",
    ".swift",
  ];

  const getFileType = (fileName: string): string => {
    const extension = fileName.toLowerCase().split(".").pop();
    const typeMap: { [key: string]: string } = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      php: "php",
      rb: "ruby",
      go: "go",
      rs: "rust",
      swift: "swift",
    };
    return typeMap[extension || ""] || "text";
  };

  const isValidFile = (fileName: string): boolean => {
    return supportedExtensions.some((ext) =>
      fileName.toLowerCase().endsWith(ext),
    );
  };

  const handleFiles = async (files: FileList) => {
    setError(null);
    setIsProcessing(true);

    const fileArray = Array.from(files);

    // Validate file count
    if (multiple && fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      setIsProcessing(false);
      return;
    }

    // Validate each file
    const invalidFiles = fileArray.filter((file) => !isValidFile(file.name));
    if (invalidFiles.length > 0) {
      setError(
        `Unsupported file type(s): ${invalidFiles
          .map((f) => f.name)
          .join(", ")}`,
      );
      setIsProcessing(false);
      return;
    }

    // Check file sizes
    const oversizedFiles = fileArray.filter(
      (file) => file.size > 5 * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      setError(
        `File(s) too large: ${oversizedFiles
          .map((f) => f.name)
          .join(", ")} (max 5MB)`,
      );
      setIsProcessing(false);
      return;
    }

    try {
      const codeFiles: CodeFile[] = await Promise.all(
        fileArray.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            content,
            type: getFileType(file.name),
          };
        }),
      );

      onFileUpload(codeFiles);
    } catch (err) {
      setError("Failed to read file content(s)");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
          isDragOver
            ? "border-blue-400 bg-blue-900/20"
            : "border-white/20 hover:border-white/30"
        } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          accept={supportedExtensions.join(",")}
          multiple={multiple}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Upload code file${multiple ? "s" : ""}`}
        />

        <div className="space-y-3">
          <div
            className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
              isDragOver ? "bg-blue-900/30" : "bg-white/10"
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-blue-400" />
            ) : (
              <Upload
                className={`h-6 w-6 ${
                  isDragOver ? "text-blue-400" : "text-gray-400"
                }`}
              />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {isProcessing ? (
                "Processing files..."
              ) : (
                <>
                  Drop your code file{multiple ? "(s)" : ""} here, or{" "}
                  <span className="text-blue-400">browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {multiple ? `Up to ${maxFiles} files. ` : ""}Supports: JS, TS,
              Python, Java, C++, and more. Max 5MB per file.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-800/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300"
            title="Dismiss error"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="text-xs text-gray-400">
        <p className="font-medium mb-1">Supported file types:</p>
        <p>{supportedExtensions.join(", ")}</p>
        <p className="mt-1">
          Maximum file size: 1MB{multiple ? ` • Maximum ${maxFiles} files` : ""}
        </p>
      </div>
    </div>
  );
};
