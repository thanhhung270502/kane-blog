import { asError } from "./error.util";

export const base64ToFile = (base64: string, fileName: string, fileType: string): File => {
  const base64Parts = base64.split(",");
  const base64Data = base64Parts[1];

  if (!base64Data) {
    throw asError("Invalid base64 string format");
  }

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: fileType });

  return new File([blob], fileName, { type: fileType });
};
