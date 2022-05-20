import dotenv from "dotenv";

const variant = process.env.APP_VARIANT || "development";

const defaultEnvFilePerVariant = {
  development: ".env/dev.env",
  preview: ".env/preview.env",
  production: ".env/prod.env",
};

const envFile = process.env.ENV_FILE || defaultEnvFilePerVariant[variant];

dotenv.config({ path: envFile });

export default {
  name: process.env.APP_NAME || "concerto",
  slug: "concerto",
  version: "0.1.0",
  orientation: "default",
  platforms: ["android"],
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  jsEngine: "hermes",
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: process.env.PACKAGE_NAME || "com.spietras.concerto",
  },
  androidNavigationBar: {
    visible: "immersive",
  },
  extra: {
    serverUrl: process.env.SERVER_URL,
  },
  plugins: [
    [
      "./plugins/withMaven.js",
      [
        "https://cdn.jsdelivr.net/gh/kshoji/USB-MIDI-Driver@master/MIDIDriver/snapshots",
      ],
    ],
    "@config-plugins/react-native-webrtc",
  ],
};
