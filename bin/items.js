"use strict";

const fs = require('fs');
const tools = require('./tools');
const logger = require('./logger');

let items = require('./../src/data/items.json');

function getTranslations() {
    let i18n = {}, matches;

    fs.readdirSync('./../src/i18n').map(file => {
        matches = file.match(/(.*).items.json/);

        if (matches) {
            i18n[matches[1]] = require('./../src/i18n/' + file);
        }
    });

    return i18n;
}

const itemsCheck = function (args = {}) {
    let result = true, i18n = getTranslations();

    Object.values(items).map(item => {
        for (let i in i18n) if (i18n.hasOwnProperty(i)) {
            if (i18n[i][item.uid] === undefined) {
                result = false;
                logger.warn(`${i} translation for ${item.type} ${item.name} (${item.uid}) does not exists`);
            }
        }

        if (['SPRAY', 'ICON',].indexOf(item.type) !== -1) {
            if (!fs.existsSync(`./../src/assets/${item.type.toLowerCase()}s/${item.uid}.png`)) {
                result = false;
                logger.warn(`asset for ${item.type} ${item.name} (${item.uid}) does not exists`);
            }
        }
    });

    if (result) {
        logger.success('items check succeed');
    } else {
        logger.failed('items check failed');
    }

    return result;
};

const itemsImport = function (args = {}) {
    if (!args['f'] || typeof args['f'] !== 'string') {
        logger.fatal('tsv file is missing');
    }

    if (!fs.existsSync(args['f'])) {
        logger.fatal(`'${args['f']}' does not exists`);
    }

    let prefix, addedCount = 0, skippedCount = 0;

    fs.readFileSync(args['f'], 'utf-8').split('\n').map((item, index) => {
        if (index === 0) {
            return;
        }

        item = item.split('\t');

        if (item.length < 7) {
            return;
        }

        item[6] = item[6].replace('\r', '');

        item[0] = item[0] === 'true';
        item[4] = item[4] === 'false' ? false : item[4];
        item[5] = item[5] === 'true';
        item[6] = item[6] === 'false' ? false : item[6];

        prefix = [item[2]];

        if (item[4]) {
            prefix.push(item[4]);
        }

        item = {
            uid: tools.uid({p: prefix, s: item[1],}, false),
            default: item[0],
            name: item[1],
            type: item[2],
            rarity: item[3],
            hero: item[4],
            price: item[5],
            event: item[6],
        };

        if (items[item.uid]) {
            skippedCount++;
        } else {
            addedCount++;

            items[item.uid] = item;
        }
    });

    if (addedCount === 0 && skippedCount === 0) {
        logger.info('nothing to update');
    } else {
        fs.writeFileSync('./../src/data/items.json', JSON.stringify(items, null, 2));

        if (addedCount) {
            logger.success(`${addedCount} item(s) added`);
        }

        if (skippedCount) {
            logger.success(`${skippedCount} item(s) skipped`);
        }
    }
};

const itemsSave = function (args = {}) {
    if (!itemsCheck()) {
        logger.fatal('save canceled');
    }

    let output = `/*\n * \n * THIS FILE GENERATED AUTOMATICALLY\n * DO NOT MODIFY\n * \n */\n\n`;

    output += `import Items from './../Items';\nimport Events from './../Events';\nimport Heroes from './../Heroes';\n\nexport default {\n`;

    for (let i in items) if (items.hasOwnProperty(i)) {
        output += `    '${i}': {\n`;
        output += `        uid: '${items[i].uid}',\n`;
        if (items[i].type === 'ICON') {
            output += `        thumbnail: require('./../assets/icons/${items[i].uid}.png'),\n`;
            output += `        preview: \`/items/previews/\${Items.TYPE.${items[i].type}}/${items[i].uid}.png\`,\n`;
        }
        if (items[i].type === 'SPRAY') {
            output += `        thumbnail: require('./../assets/sprays/${items[i].uid}.png'),\n`;
            output += `        preview: \`/items/previews/\${Items.TYPE.${items[i].type}}/${items[i].uid}.png\`,\n`;
        }
        output += `        default: ${items[i].default},\n`;
        output += `        name: \`${items[i].name}\`,\n`;
        output += `        type: Items.TYPE.${items[i].type},\n`;
        output += `        rarity: Items.RARITY.${items[i].rarity},\n`;
        output += `        hero: ${items[i].hero ? 'Heroes.' + items[i].hero : false},\n`;
        output += `        price: ${items[i].price ? 'Items.PRICE.' + (!items[i].event || items[i].event === 'GENERAL' ? 'DEFAULT' : 'EVENT') + `[Items.RARITY.${items[i].rarity}]` : false},\n`;
        output += `        event: ${items[i].event ? 'Events.' + items[i].event : false},\n`;
        output += `    },\n`;
    }

    output += `};\n`;

    fs.writeFileSync('./../src/data/items.js', output);

    logger.success('items saved');
};

module.exports = {
    check: itemsCheck,
    import: itemsImport,
    save: itemsSave,
};
