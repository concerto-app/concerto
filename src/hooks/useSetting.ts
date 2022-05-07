import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export default function useSetting(key: string) {
  return useAsyncStorage(`settings/${key}`);
}
