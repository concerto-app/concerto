import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCancellable from "./useCancellable";

export default function useAsyncStorage(key: string, defaultValue?: string) {
  const [value, setValue] = React.useState<string | undefined>(defaultValue);

  useCancellable(
    async (cancelInfo) => {
      const value = await AsyncStorage.getItem(key);
      if (value !== null && !cancelInfo.cancelled) setValue(value);
    },
    [key]
  );

  const handleSetValue = React.useCallback(
    async (newValue: string) => {
      await AsyncStorage.setItem(key, newValue);
      setValue(newValue);
    },
    [key]
  );

  return {
    value,
    setValue: handleSetValue,
  };
}
