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
    uploadType: string,
  ) => {
    try {
      setError(null);
      setProcessedData(null);
      setIsDuplicate(false);
      setExistingBill(null);

      setSavedLanguage(language.toLowerCase());
      setSavedUploadType(uploadType.toLowerCase());

      // ── STEP 1: Upload image to Firebase (0% → 30%) ─────────────
      setStatusMessage("Uploading image...");
      setProgress(20);

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "bill.jpg",
      } as any);
      formData.append("upload_type", uploadType.toLowerCase());

      console.log("STEP 1: Uploading image to Firebase...");
      const uploadRes = await billsAPI.upload(formData);
      console.log("STEP 1 response:", JSON.stringify(uploadRes?.data));
      setProgress(30);

      const firebaseUrl = uploadRes?.data?.firebase_url;
      if (!firebaseUrl)
        throw new Error("Firebase upload failed — no URL returned");

      setSavedFirebaseUrl(firebaseUrl);

      // ── STEP 2: OCR + classify + duplicate check (30% → 100%) ─────
      await runProcessStep(
        firebaseUrl,
        language.toLowerCase(),
        uploadType.toLowerCase(),
      );
    } catch (err) {
      setError("Upload failed. Please try again.");
      throw err;
    }
  };

  const runProcessStep = async (
    firebaseUrl: string,
    language: string,
    uploadType: string,
  ) => {
    try {
      setStatusMessage("Extracting text...");
      setProgress(50);

      console.log("STEP 2: Processing image...", {
        firebaseUrl,
        language,
        uploadType,
      });

      const processRes = await billsAPI.process({
        firebase_url: firebaseUrl, // <-- snake_case required by backend
        language,
        upload_type: uploadType, // <-- snake_case required by backend
      });

      console.log("STEP 2 response:", JSON.stringify(processRes?.data));

      setProgress(70);
      setStatusMessage("Detecting items...");
      setProgress(90);
      setStatusMessage("Analyzing warranties...");

      if (processRes.data.is_duplicate) {
        setIsDuplicate(true);
        setExistingBill(processRes.data.existing_bill);
        return; // stop here — DuplicateModal will show
      }

      setProgress(100);
      setStatusMessage("Almost done...");
      setProcessedData(processRes.data);
    } catch (err) {
      setError("Processing failed. Please try again.");
      throw err;
    }
  };

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
