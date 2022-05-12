export const defaultKeyboardLayoutProps = {
  octavesNumber: 7,
  keyWidth: 90,
  keyHeight: 230,
  keyDepth: 10,
  spacing: 5,
};

export const blackKeyWidthScale = 2 / 3;
export const blackKeyHeightScale = 0.5;

export const keyColors = {
  white: {
    foregroundTop: "#dcdcdc",
    foregroundBottom: "#f7f7f7",
    side: "#ffffff",
    border: "#252525",
  },
  black: {
    foregroundTop: "#252525",
    foregroundBottom: "#353535",
    side: "#5b5b5b",
    border: "#252525",
  },
};

export const blacksGapIndex: Record<string, number> = {
  Db: 1,
  Eb: 2,
  Gb: 4,
  Ab: 5,
  Bb: 6,
};

export const noteNameColors: Record<string, string> = {
  C: "#ff0939",
  Db: "#ff9244",
  D: "#fffc58",
  Eb: "#83fe56",
  E: "#00ff54",
  F: "#00ffa1",
  Gb: "#00fffe",
  G: "#009ffa",
  Ab: "#0047f8",
  A: "#9a41f8",
  Bb: "#ff32f9",
  B: "#ff1c97",
};
