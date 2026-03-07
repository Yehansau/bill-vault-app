import { useState } from "react";
import { billsAPI } from "@/services/api";

export const useBillUpload = () => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [existingBill, setExistingBill] = useState<any>(null);
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Stored after Step 1 so continueAsDuplicate can reuse them
  const [savedFirebaseUrl, setSavedFirebaseUrl] = useState("");
  const [savedLanguage, setSavedLanguage] = useState("english");
  const [savedUploadType, setSavedUploadType] = useState("receipt");

  const startUpload = async (
    imageUri: string,
    language: string,
    uploadType: string
  ) => {
    setError(null);
    setProcessedData(null);
    setIsDuplicate(false);
    setExistingBill(null);

    // Save language + uploadType so continueAsDuplicate can use them
    setSavedLanguage(language);
    setSavedUploadType(uploadType);

    // ── STEP 1: Upload image to Firebase (0% → 30%) ──────────────────
    setStatusMessage("Uploading image...");
    setProgress(20);

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "bill.jpg",
    } as any);
    formData.append("upload_type", uploadType);

    const uploadRes = await billsAPI.upload(formData);
    setProgress(30);

    const firebaseUrl = uploadRes.data.firebase_url;

    // Save firebase_url so continueAsDuplicate can reuse it
    setSavedFirebaseUrl(firebaseUrl);

    // ── STEP 2: OCR + classify + duplicate check (30% → 100%) ────────
    await runProcessStep(firebaseUrl, language, uploadType);
  };

  // Shared Step 2 logic — used by both startUpload and continueAsDuplicate
  const runProcessStep = async (
    firebaseUrl: string,
    language: string,
    uploadType: string
  ) => {
    setStatusMessage("Extracting text...");
    setProgress(50);

    const processRes = await billsAPI.process({
      firebase_url: firebaseUrl,
      language,
      upload_type: uploadType,
    });

    setProgress(70);
    setStatusMessage("Detecting items...");
    setProgress(90);
    setStatusMessage("Analyzing warranties...");

    // Backend now returns is_duplicate after comparing extracted data
    if (processRes.data.is_duplicate) {
      setIsDuplicate(true);
      setExistingBill(processRes.data.existing_bill);
      return; // stop here — DuplicateModal will show
    }

    // All good — set processed data, processing.tsx will navigate
    setProgress(100);
    setStatusMessage("Almost done...");
    setProcessedData(processRes.data);
  };

  // Called when user taps "Upload Anyway" in DuplicateModal.
  // Skips Step 1 (image already uploaded) and reruns Step 2
  // with a flag to skip the duplicate check on the backend.
  const continueAsDuplicate = async () => {
    setIsDuplicate(false);
    setExistingBill(null);
    setProgress(30);

    try {
      await runProcessStep(savedFirebaseUrl, savedLanguage, savedUploadType);
    } catch (err) {
      setError("Processing failed. Please try again.");
      throw err;
    }
  };

  const reset = () => {
    setProgress(0);
    setStatusMessage("");
    setIsDuplicate(false);
    setExistingBill(null);
    setProcessedData(null);
    setError(null);
    setSavedFirebaseUrl("");
  };

  return {
    progress,
    statusMessage,
    isDuplicate,
    existingBill,
    processedData,
    error,
    startUpload,
    continueAsDuplicate,
    reset,
  };
};