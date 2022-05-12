import { useState } from "react";
import { Skia } from "@shopify/react-native-skia/src/skia/Skia";
import { SkSVG } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";
import useCancellable from "./useCancellable";

export default function useSvg(uri: string) {
  const [svg, setSvg] = useState<SkSVG>();

  useCancellable(
    (cancelInfo) => {
      FileSystem.readAsStringAsync(uri).then((data) => {
        const newSvg = Skia.SVG.MakeFromString(data);
        if (!cancelInfo.cancelled && newSvg) setSvg(newSvg);
      });
    },
    [uri]
  );

  return svg;
}
