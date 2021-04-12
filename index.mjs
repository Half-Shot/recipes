import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import assert from 'assert';

const REQUIRED_KEYS = [
    'name',
    'description',
    'ingredients',
    'steps'
];

(async() => {
    for (const recipe of await fs.promises.readdir("./recipes")) {
        const basename = path.basename(recipe, path.extname(recipe));
        const out = `${basename}.md`;
        console.log(`Generating ${recipe} > ${out}`);
        const data = yaml.load(await fs.promises.readFile(path.join("./recipes", recipe)));
        const mdFile = fs.createWriteStream(out);
        REQUIRED_KEYS.forEach(k => assert.ok(data[k]))  
        mdFile.write(`${data.name}\n`);
        mdFile.write(`---------------\n`)
        mdFile.write(`${data.description}\n`);
        for (const image of data.images || []) {
            mdFile.write(`![${image}](images/${image})\n`);
        }
        mdFile.write(`\n## Ingredients\n`);
        for (const ingredient of data.ingredients) {
            mdFile.write(`- ${ingredient}\n`);
        }
        mdFile.write(`\n## Steps\n`);
        for (const step of data.steps) {
            const time = step.time ? ` (${step.time})` : '';
            mdFile.write(`1. ${step.step}${time}\n`);
        }
        mdFile.write(`1. Serve\n`);
        mdFile.write(`\n## Sources\n`);
        for (const source of data.sources || []) {
            mdFile.write(`- ${source}\n`);
        }

        mdFile.close();
    }   
})().catch((ex) => {
    console.log(ex);
    process.exit(1);
})
