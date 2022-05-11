import { useEffect, useState } from "react";
import { Skia } from "@shopify/react-native-skia/src/skia/Skia";
import { SkSVG } from "@shopify/react-native-skia";
import * as FileSystem from "expo-file-system";

export default function useSvg(uri: string) {
  const [svg, setSvg] = useState<SkSVG>();

  useEffect(() => {
    let cancelled = false;

    const loadSvg = async (uri: string) => {
      const data = await FileSystem.readAsStringAsync(uri);
      const newSvg = Skia.SVG.MakeFromString(data);
      if (!cancelled && newSvg) setSvg(newSvg);
    };

    loadSvg(uri).catch((error) => console.log(error));

    return () => {
      cancelled = true;
    };
  }, [uri]);

  return svg;
}
