import useAsyncStorage from "./useAsyncStorage";

export default function useSetting(key: string, defaultValue?: string) {
  return useAsyncStorage(`settings/${key}`, defaultValue);
}
