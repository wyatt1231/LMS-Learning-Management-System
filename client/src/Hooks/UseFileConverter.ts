export const fileToBase64 = (blob: Blob): Promise<string | null> =>
  new Promise((resolve, reject) => {
    if (!blob) {
      return resolve(null);
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(blob);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        return resolve(btoa(reader.result));
      }
    };

    reader.onerror = (error: any) => {
      return resolve(null);
    };
  });
