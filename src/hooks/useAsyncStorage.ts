import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAsyncStorage(key: string, defaultValue?: string) {
  const [value, setValue] = React.useState<string | undefined>(defaultValue);

  React.useEffect(() => {
    let cancelled = false;

    const getValue = async (key: string) => {
      const value = await AsyncStorage.getItem(key);
      if (value !== null && !cancelled) setValue(value);
    };

    getValue(key).catch((error) => console.log(error));

    return () => {
      cancelled = true;
    };
  }, [key]);

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
