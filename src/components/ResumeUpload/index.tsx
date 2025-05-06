import Image from "next/image";
import styles from "./index.module.scss";
import { Progress, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { storagePrefix } from "@/utils/storage";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";

export function base64ToFile(
  base64String: string,
  filename: string,
  mimeType: string
): File {
  const byteString = atob(base64String.split(",")[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new File([ab], filename, { type: mimeType });
}

export default function ResumeUpload({
  file,
  setFile,
  progress,
  setProgress,
}: {
  file: File | null;
  setFile: (file: File | null) => void;
  progress: number;
  setProgress: (progress: number) => void;
}) {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const isMobileOrTablet = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const savedFileName = localStorage.getItem(
      `${storagePrefix}uploadedFileName`
    );
    const savedFileType = localStorage.getItem(
      `${storagePrefix}uploadedFileType`
    );
    const savedProgress = localStorage.getItem(
      `${storagePrefix}uploadProgress`
    );
    const savedFile = localStorage.getItem(`${storagePrefix}uploadedFile`);

    if (savedFile && savedFileName && savedFileType && savedProgress) {
      const file = base64ToFile(savedFile, savedFileName, savedFileType);
      setFile(file);
      setProgress(Number(savedProgress));
    }
  }, []);

  useEffect(() => {
    if (file) {
      localStorage.setItem(`${storagePrefix}uploadedFileName`, file.name);
      localStorage.setItem(`${storagePrefix}uploadedFileType`, file.type);
      localStorage.setItem(
        `${storagePrefix}uploadProgress`,
        progress.toString()
      );
    }
  }, [file, progress]);

  const handleFileChange = (files: FileWithPath[]) => {
    const selectedFile = files?.[0];
    if (!selectedFile) return;

    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(selectedFile.type)
    ) {
      alert("Only PDF or DOC/DOCX files are allowed.");
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);
    simulateUpload(selectedFile);

    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      const base64String = event.target?.result as string;
      localStorage.setItem(`${storagePrefix}uploadedFile`, base64String);
    };

    reader.readAsDataURL(selectedFile);
  };

  const simulateUpload = (file: File) => {
    let uploaded = 0;
    const total = file.size;
    const interval = setInterval(() => {
      uploaded += total / 20; // simulate 5% increments
      const percent = Math.min((uploaded / total) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, 150);
  };

  const handleRemove = () => {
    setFile(null);
    setProgress(0);
    setIsUploading(false);
    localStorage.removeItem(`${storagePrefix}uploadedFileName`);
    localStorage.removeItem(`${storagePrefix}uploadedFileType`);
    localStorage.removeItem(`${storagePrefix}uploadProgress`);
  };

  const formatSize = (size: number) => {
    return (size / 1024).toFixed(0) + " KB";
  };

  return (
    <>
      <Dropzone
        style={{ width: isMobileOrTablet ? "auto" : "530px" }}
        onDrop={handleFileChange}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.pdf, MIME_TYPES.doc, MIME_TYPES.docx]}
      >
        <div>
          <h3 className={styles.heading}>Upload Resume</h3>
          <div className={styles.uploadBox}>
            <Image
              width={27}
              height={27}
              src="/images/upload-icon.svg"
              alt="Upload Icon"
            />
            <div className={styles.description}>
              Choose a file or drag and drop it here
            </div>
            <div className={styles.note}>
              Please upload your resume (PDF, DOCS formats only)
            </div>
            <button className={styles.uploadButton}>
              {file ? "File selected" : "Browse File"}
            </button>
          </div>
        </div>
      </Dropzone>
      {file && (
        <div className={styles.uploadFileBoxContainer}>
          <div className={styles.uploadedFileBoxSubContainer}>
            <Image
              width={55}
              height={53}
              src="/images/pdf-icon.svg"
              alt="PDF Icon"
            />
            <div className={styles.fileDetails}>
              <div className={styles.crossIconContainer}>
                <div className={styles.fileName}>{file.name}</div>
                <Image
                  width={19}
                  height={19}
                  src={
                    isUploading
                      ? "/images/cross-icon.svg"
                      : "/images/delete-icon.svg"
                  }
                  alt={isUploading ? "Cross Icon" : "Delete Icon"}
                  className={styles.crossIcon}
                  onClick={handleRemove}
                />
              </div>
              <div className={styles.fileSize}>
                {formatSize((progress / 100) * file.size)} of{" "}
                {formatSize(file.size)}
                <>
                  <div className={styles.dot}></div>
                  <Image
                    width={15}
                    height={15}
                    src={
                      isUploading
                        ? "/images/loader-icon.svg"
                        : "/images/check-icon.svg"
                    }
                    alt={isUploading ? "Loader Icon" : "Check Icon"}
                    className={
                      isUploading ? styles.loaderIcon : styles.checkIcon
                    }
                  />
                  <Text color="black" className={styles.uploadingText}>
                    {isUploading ? "Uploading..." : "Completed"}
                  </Text>
                </>
              </div>
            </div>
          </div>
          <Progress
            color="red"
            value={progress}
            className={styles.progressBar}
          />
        </div>
      )}
    </>
  );
}
