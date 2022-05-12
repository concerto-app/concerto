const { withProjectBuildGradle } = require("@expo/config-plugins");

function urlToMavenRepository(url) {
  return (
    "allprojects {\n" +
    "    repositories {\n" +
    "       maven {\n" +
    `            url '${url}'\n` +
    "       }\n" +
    "   }\n" +
    "}"
  );
}

module.exports = (config, urls) => {
  return withProjectBuildGradle(config, (config) => {
    if (urls.length === 0) return config;
    config.modResults.contents += "\n";
    urls.forEach((url) => {
      const repositoryString = urlToMavenRepository(url);
      config.modResults.contents += repositoryString + "\n";
    });
    return config;
  });
};
