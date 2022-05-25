import useCancellable from "./useCancellable";
import React from "react";
import axios from "axios";

export type FetchState = "idle" | "fetching" | "fetched" | "error";

export default function useFetch<T>(url: string) {
  const cache = React.useRef<Record<string, T>>({}).current;
  const [status, setStatus] = React.useState<FetchState>("idle");
  const [data, setData] = React.useState<T>();
  const [error, setError] = React.useState<any>();

  useCancellable(
    (cancelInfo) => {
      if (!url) return;

      const controller = new AbortController();

      const fetchData = async () => {
        if (cancelInfo.cancelled) return;

        setStatus("fetching");
        if (cache[url]) {
          if (cancelInfo.cancelled) return;
          setData(cache[url]);
          setStatus("fetched");
        } else {
          try {
            const response = await axios.get<T>(url, {
              signal: controller.signal,
            });
            if (cancelInfo.cancelled) return;
            const newData = response.data;
            cache[url] = newData;
            setData(newData);
            setStatus("fetched");
          } catch (e) {
            if (cancelInfo.cancelled) return;
            setError(e);
            setStatus("error");
          }
        }
      };

      fetchData().then();

      return () => controller.abort();
    },
    [url]
  );

  return {
    status: status,
    data: data,
    error: error,
  };
}
