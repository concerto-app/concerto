import React from "react";
import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export default function useNetworkAsset(url: string) {
  const [fileUri, setFileUri] = React.useState<string | null>(null);

  const generateFileUri = async (url: string) => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      url
    );
    return FileSystem.cacheDirectory + hash;
  };

  const getFileInfo = async (fileUri: string) =>
    await FileSystem.getInfoAsync(fileUri);

  const downloadFile = async (url: string, fileUri: string) =>
    await FileSystem.downloadAsync(url, fileUri);

  const getUri = async (url: string) => {
    const generatedFileUri = await generateFileUri(url);
    const fileInfo = await getFileInfo(generatedFileUri);
    if (fileInfo.exists) return setFileUri(fileInfo.uri);
    const result = await downloadFile(url, generatedFileUri);
    console.log("Downloading");
    setFileUri(result.uri);
  };

  React.useEffect(() => {
    getUri(url).then();
  }, [url]);

  return fileUri;
}
