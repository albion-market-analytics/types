const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

(async () => {
  const worldResponse = await axios.get(
    "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json",
  );
  const itemsResponse = await axios.get(
    "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json",
  );

  ejs.renderFile(
    path.resolve(__dirname, "./templates/items.ejs"),
    {
      items: itemsResponse.data,
    },
    {},
    (err, str) => {
      if (err) {
        throw err;
      }

      fs.outputFileSync(path.resolve(__dirname, "../items.ts"), str, "utf8");
    },
  );

  const languages = Object.keys(itemsResponse.data[0].LocalizedNames);
  languages.forEach((language) => {
    ejs.renderFile(
      path.resolve(__dirname, "./templates/i18n.ejs"),
      {
        language,
        items: itemsResponse.data,
      },
      {},
      (err, str) => {
        if (err) {
          throw err;
        }

        fs.outputFileSync(
          path.resolve(__dirname, `../i18n/${language}.json`),
          str,
          "utf8",
        );
      },
    );
  });

  ejs.renderFile(
    path.resolve(__dirname, "./templates/world.ejs"),
    {
      world: worldResponse.data,
    },
    {},
    (err, str) => {
      if (err) {
        throw err;
      }

      fs.outputFileSync(path.resolve(__dirname, "../world.ts"), str, "utf8");
    },
  );
})();
