import React from "react";

type CancelInfo = {
  cancelled: boolean;
};

type Callback = (cancelInfo: CancelInfo) => any;

export default function useCancellable(
  callback: Callback,
  deps?: React.DependencyList
) {
  React.useEffect(() => {
    let cancelInfo: CancelInfo = {
      cancelled: false,
    };

    setTimeout(() => callback(cancelInfo));

    return () => {
      cancelInfo.cancelled = true;
    };
  }, deps);
}
