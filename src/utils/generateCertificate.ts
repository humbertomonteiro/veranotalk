/**
 * generateCertificate.ts
 * Geração de certificados com configuração persistida no Firestore
 * e imagem no Firebase Storage.
 */

import { db, storage } from "../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface CertificateConfig {
  xPercent: number;
  yPercent: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
  imageUrl?: string; // URL pública no Firebase Storage
}

export const DEFAULT_CONFIG: CertificateConfig = {
  xPercent: 50,
  yPercent: 60,
  fontSize: 48,
  fontFamily: "helvetica",
  color: "#1a1a1a",
  align: "center",
  bold: false,
  italic: false,
};

const FIRESTORE_DOC = "settings/certificate";

// ─── Firestore ────────────────────────────────────────────────────────────────

export async function saveCertificateConfig(
  config: CertificateConfig
): Promise<void> {
  const [col, docId] = FIRESTORE_DOC.split("/");
  await setDoc(doc(db, col, docId), config);
}

export async function loadCertificateConfig(): Promise<CertificateConfig> {
  try {
    const [col, docId] = FIRESTORE_DOC.split("/");
    const snap = await getDoc(doc(db, col, docId));
    if (!snap.exists()) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...snap.data() } as CertificateConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

// ─── Firebase Storage ─────────────────────────────────────────────────────────

export async function uploadCertificateImage(file: File): Promise<string> {
  const storageRef = ref(storage, "certificate/background");
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ─── Canvas / PDF ─────────────────────────────────────────────────────────────

export async function renderCertificateCanvas(
  name: string,
  config: CertificateConfig,
  imageUrl: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // crossOrigin só é necessário para URLs remotas (Firebase Storage).
    // Blob URLs e data URLs locais não precisam e quebram com essa flag.
    const isRemote =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");
    if (isRemote) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(img, 0, 0);

      const fontStyle = [
        config.italic ? "italic" : "",
        config.bold ? "bold" : "",
        `${config.fontSize}px`,
        config.fontFamily === "helvetica"
          ? "Helvetica, Arial, sans-serif"
          : config.fontFamily === "times"
          ? "Times New Roman, serif"
          : config.fontFamily,
      ]
        .filter(Boolean)
        .join(" ");

      ctx.font = fontStyle;
      ctx.fillStyle = config.color;
      ctx.textAlign = config.align;
      ctx.textBaseline = "middle";

      const x = (config.xPercent / 100) * canvas.width;
      const y = (config.yPercent / 100) * canvas.height;
      ctx.fillText(name, x, y);

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

export async function downloadCertificatePDF(
  name: string,
  config: CertificateConfig,
  imageUrl: string,
  filename = "certificado-verano-talk-2026"
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const canvas = await renderCertificateCanvas(name, config, imageUrl);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const ratio = canvas.height / canvas.width;

  const isLandscape = ratio < 1;
  const doc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  let drawW = pageW;
  let drawH = pageW * ratio;
  if (drawH > pageH) {
    drawH = pageH;
    drawW = pageH / ratio;
  }

  const offsetX = (pageW - drawW) / 2;
  const offsetY = (pageH - drawH) / 2;

  doc.addImage(imgData, "JPEG", offsetX, offsetY, drawW, drawH);
  doc.save(`${filename}.pdf`);
}
