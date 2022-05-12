import React from "react";

type CancelInfo = {
  cancelled: boolean;
};

type Callback = (cancelInfo: CancelInfo) => void | (() => any);

export default function useCancellable(
  callback: Callback,
  deps?: React.DependencyList
) {
  React.useEffect(() => {
    let cancelInfo: CancelInfo = {
      cancelled: false,
    };

    const cleanup = callback(cancelInfo);

    return () => {
      cancelInfo.cancelled = true;
      cleanup && cleanup();
    };
  }, deps);
}
