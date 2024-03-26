const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const axios = require("axios");

const outPath = path.resolve(__dirname, '../index.d.ts');

(async () => {
    const worldResponse = await axios.get('https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/world.json');
    const itemsResponse = await axios.get('https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json');
    ejs.renderFile(path.resolve(__dirname, './template.ejs'), {
        world: worldResponse.data,
        items: itemsResponse.data
    }, {}, (err, str) => {
        fs.writeFileSync(outPath, str, 'utf8');
    });
})();

