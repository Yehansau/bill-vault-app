import { useState } from "react";
import { billsAPI } from "@/services/api";



export const useBillUpload = () => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);        
  const [existingBill, setExistingBill] = useState<any>(null);  
  const [processedData, setProcessedData] = useState<any>(null);
  // ... other state


  const startUpload = async (imageUri: string, language: string, uploadType: string) => {


    // STEP 1: Upload image (0% → 30%)
    setStatusMessage('Uploading image...');
    setProgress(20);
    const formData = new FormData();
    formData.append('image', { uri: imageUri, type: 'image/jpeg', name: 'bill.jpg' } as any);
    formData.append('upload_type', uploadType);
    const uploadRes = await billsAPI.upload(formData);
    setProgress(30);


    // Check duplicate
    setStatusMessage('Checking for duplicates...');
    if (uploadRes.data.is_duplicate) {
      setIsDuplicate(true);
      setExistingBill(uploadRes.data.existing_bill);
      return;   // stop here — show DuplicateModal
    }


    // STEP 2: Process image (30% → 90%)
    setStatusMessage('Extracting text...');
    setProgress(50);
    const processRes = await billsAPI.process({
      firebase_url: uploadRes.data.firebase_url,
      language,
      upload_type: uploadType
    });
    setProgress(70);
    setStatusMessage('Detecting items...');
    setProgress(90);
    setStatusMessage('Analyzing warranties...');


    // STEP 3: Done
    setProgress(100);
    setStatusMessage('Almost done...');
    setProcessedData(processRes.data);
  };


  return { progress, statusMessage, isDuplicate, existingBill, processedData, startUpload };
};
