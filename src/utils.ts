import * as FileSystem from "expo-file-system";
import * as Crypto from "expo-crypto";

export function mapMap<K, VA, VB>(
  m: Map<K, VA>,
  fn: (v: VA, k: K, i: number) => VB
) {
  return new Map(
    Array.from(m, ([key, value], index) => [key, fn(value, key, index)])
  );
}

export function normalizeDirectory(p: string): string {
  return p.replace(/^\s*(\/*\s*)*|(\s*\/*)*\s*$/gm, "") + "/";
}

export async function downloadNetworkAsset(
  url: string,
  directory: string | null = FileSystem.documentDirectory
) {
  const cleanDirectory = normalizeDirectory(directory || "");

  const makeDirectory = async (directory: string) =>
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  const generateFileUri = async (url: string, directory: string) => {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.MD5,
      url
    );
    return directory + hash;
  };

  const getFileInfo = async (fileUri: string) =>
    await FileSystem.getInfoAsync(fileUri);

  const downloadFile = async (url: string, fileUri: string) =>
    await FileSystem.downloadAsync(url, fileUri);

  const getUri = async (url: string, directory: string) => {
    await makeDirectory(directory);
    const generatedFileUri = await generateFileUri(url, directory);
    const fileInfo = await getFileInfo(generatedFileUri);
    if (fileInfo.exists) return fileInfo.uri;
    return (await downloadFile(url, generatedFileUri)).uri;
  };

  return await getUri(url, cleanDirectory);
}
