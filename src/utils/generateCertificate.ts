/**
 * generateCertificate.ts
 * Configuração persistida no Firestore — imagem salva como base64
 * direto no documento, sem precisar do Firebase Storage.
 */

import { db } from "../config/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface CertificateConfig {
  xPercent: number;
  yPercent: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: "left" | "center" | "right";
  bold: boolean;
  italic: boolean;
  imageBase64?: string; // imagem em base64 salva no Firestore
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

// ─── Imagem — converte File para base64 comprimido ────────────────────────────

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      // Limita a 2000px de largura para garantir que cabe no Firestore (< 1MB)
      const maxWidth = 2000;
      const scale =
        img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // JPEG 0.85 — boa qualidade visual com tamanho reduzido
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Falha ao carregar imagem"));
    };
    img.src = objectUrl;
  });
}

// ─── Canvas / PDF ─────────────────────────────────────────────────────────────

export async function renderCertificateCanvas(
  name: string,
  config: CertificateConfig,
  imageSource: string
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (
      imageSource.startsWith("http://") ||
      imageSource.startsWith("https://")
    ) {
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
      ctx.fillText(
        name,
        (config.xPercent / 100) * canvas.width,
        (config.yPercent / 100) * canvas.height
      );

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = imageSource;
  });
}

export async function downloadCertificatePDF(
  name: string,
  config: CertificateConfig,
  imageSource: string,
  filename = "certificado-verano-talk-2026"
): Promise<void> {
  const { default: jsPDF } = await import("jspdf");

  const canvas = await renderCertificateCanvas(name, config, imageSource);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const ratio = canvas.height / canvas.width;
  const isLandscape = ratio < 1;

  const jsdoc = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });
  const pageW = jsdoc.internal.pageSize.getWidth();
  const pageH = jsdoc.internal.pageSize.getHeight();

  let drawW = pageW;
  let drawH = pageW * ratio;
  if (drawH > pageH) {
    drawH = pageH;
    drawW = pageH / ratio;
  }

  jsdoc.addImage(
    imgData,
    "JPEG",
    (pageW - drawW) / 2,
    (pageH - drawH) / 2,
    drawW,
    drawH
  );
  jsdoc.save(`${filename}.pdf`);
}
