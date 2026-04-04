/**
 * e-KYC Utility Module
 * Ported from Onboarding Interface script.js
 */

declare const Tesseract: any;
declare const faceapi: any;

export interface OCRResult {
  foundValue: string | null;
  isValid: boolean;
}

const REGEX_AADHAAR = /^[2-9]{1}[0-9]{11}$/;
const REGEX_PAN = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Pre-processes image for OCR (Canvas-based binarization)
 */
async function preprocessImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple Thresholding Binarization
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const threshold = 120;
          const v = avg > threshold ? 255 : 0;
          data[i] = data[i+1] = data[i+2] = v;
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Runs Tesseract OCR on a document image
 */
export async function processOCR(file: File, docType: 'AADHAAR' | 'PAN'): Promise<OCRResult> {
  try {
    const imageSource = await preprocessImage(file);
    
    const { data: { text } } = await Tesseract.recognize(
      imageSource,
      'eng',
      {
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-/|'
      }
    );

    console.log(`RAW OCR OUTPUT (${docType}):`, text);
    const cleanBlock = text.replace(/[^A-Z0-9]/g, '');
    let foundValue: string | null = null;

    if (docType === 'AADHAAR') {
      const aadharMatches = text.match(/\d{4}[\s.\-]?\d{4}[\s.\-]?\d{4}/g);
      if (aadharMatches) {
        foundValue = aadharMatches[0].replace(/[\s.\-]/g, '');
      } else {
        const fuzzy = cleanBlock.match(/\d{12}/);
        if (fuzzy) foundValue = fuzzy[0];
      }
    } else if (docType === 'PAN') {
      let bestCandidate = null;
      let maxScore = 0;
      for (let i = 0; i <= cleanBlock.length - 10; i++) {
        let chunk = cleanBlock.substring(i, i + 10);
        let score = 0;
        if (/[A-Z]/.test(chunk[0])) score++;
        if (/[A-Z]/.test(chunk[1])) score++;
        if (/[A-Z]/.test(chunk[2])) score++;
        if (/[PCHFATBLJG]/.test(chunk[3])) score += 3;
        if (/[A-Z]/.test(chunk[4])) score++;
        if (/[0-9]/.test(chunk[5])) score++;
        if (/[0-9]/.test(chunk[6])) score++;
        if (/[0-9]/.test(chunk[7])) score++;
        if (/[0-9]/.test(chunk[8])) score++;
        if (/[A-Z]/.test(chunk[9])) score++;

        if (score > maxScore) {
          maxScore = score;
          bestCandidate = chunk;
        }
      }

      if (bestCandidate && maxScore >= 7) {
        let p1 = bestCandidate.substring(0, 5).replace(/0/g, 'O').replace(/1/g, 'I').replace(/5/g, 'S');
        let p2 = bestCandidate.substring(5, 9).replace(/O/g, '0').replace(/I/g, '1').replace(/S/g, '5');
        let p3 = bestCandidate.substring(9, 10).replace(/0/g, 'O').replace(/1/g, 'I');
        foundValue = p1 + p2 + p3;
      }
    }

    const isValid = foundValue ? (docType === 'AADHAAR' ? REGEX_AADHAAR.test(foundValue) : REGEX_PAN.test(foundValue)) : false;
    return { foundValue, isValid };

  } catch (err) {
    console.error("OCR ERROR:", err);
    throw err;
  }
}

/**
 * Face-api.js Logic
 */
export async function loadFaceModels() {
  const MODEL_URL = '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
  ]);
}

export async function detectFace(video: HTMLVideoElement): Promise<number> {
  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  if (detections.length > 0) {
    return Math.round(detections[0].detection.score * 100);
  }
  return 0;
}
