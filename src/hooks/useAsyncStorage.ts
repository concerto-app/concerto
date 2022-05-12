import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useCancellable from "./useCancellable";

export default function useAsyncStorage(key: string, defaultValue?: string) {
  const [value, setValue] = React.useState<string | undefined>(defaultValue);

  useCancellable(
    (cancelInfo) => {
      AsyncStorage.getItem(key).then((value) => {
        if (value !== null && !cancelInfo.cancelled) setValue(value);
      });
    },
    [key]
  );

  const handleSetValue = React.useCallback(
    (value: (previous: string) => string) => {
      setValue((previous) => {
        if (previous === undefined) return previous;
        const newValue = value(previous);
        AsyncStorage.setItem(key, newValue).then();
        return newValue;
      });
    },
    [key]
  );

  return {
    value,
    setValue: handleSetValue,
  };
}
