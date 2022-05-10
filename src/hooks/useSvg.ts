import { useEffect, useState } from "react";
import { Skia } from "@shopify/react-native-skia/src/skia/Skia";
import { SkSVG } from "@shopify/react-native-skia";

export default function useSvg(uri: string) {
  const [svg, setSvg] = useState<SkSVG | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSvg = async (uri: string) => {
      const data = await Skia.Data.fromURI(uri);
      const newSvg = Skia.SVG.MakeFromData(data);
      if (!cancelled) setSvg(newSvg);
    };

    loadSvg(uri).catch((error) => console.log(error));

    return () => {
      cancelled = true;
    };
  }, [uri]);

  return svg;
}
