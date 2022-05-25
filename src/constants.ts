import Constants from "expo-constants";
import { Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";

export const codeLength = 3;

export const fonts = {
  Nunito_700Bold,
  Nunito_800ExtraBold,
};

export const config = {
  theatreAddress: Constants.manifest?.extra?.theatreAddress,
  gruppettoAddress: Constants.manifest?.extra?.gruppettoAddress,
  gruppettoUser: Constants.manifest?.extra?.gruppettoUser,
  gruppettoPassword: Constants.manifest?.extra?.gruppettoPassword,
};

export const urls = {
  entries: `http://${config.theatreAddress}/entries`,
  connect: `ws://${config.theatreAddress}/connect`,
};

export const iceServers = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
  {
    urls: `turn:${config.gruppettoAddress}`,
    username: config.gruppettoUser,
    credential: config.gruppettoPassword,
  },
];

const defaultMidiInput = {
  value: "none",
  label: "None",
};

export const midiInputs = {
  default: defaultMidiInput.value,
  base: [defaultMidiInput],
};

const defaultInstrument = {
  value: "electric_piano_1",
  label: "Electric Piano 1",
};

export const instruments = {
  default: defaultInstrument.value,
  base: [defaultInstrument],
};
