const variant = process.env.APP_VARIANT || "development";

const namePerVariant = {
  development: "concerto (dev)",
  preview: "concerto (preview)",
  production: "concerto",
};

const packageNamePerVariant = {
  development: "com.spietras.concerto.dev",
  preview: "com.spietras.concerto.preview",
  production: "com.spietras.concerto",
};

export default {
  name: namePerVariant[variant] || "concerto",
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
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: packageNamePerVariant[variant] || "com.spietras.concerto",
  },
  androidNavigationBar: {
    visible: "immersive",
  },
  plugins: [
    [
      "./plugins/withMaven.js",
      [
        "https://cdn.jsdelivr.net/gh/kshoji/USB-MIDI-Driver@master/MIDIDriver/snapshots",
      ],
    ],
  ],
};
