const fs = require("fs");
const path = require("path");

function getAllTranslations() {
    let pathToTranslationsDir = path.resolve("src/locales")
    let translations = {};
    let translationDir = "";

    let dirs = fs.readdirSync(pathToTranslationsDir);
    for (let idx in dirs) {
        let lang = dirs[idx];
        let localeDir = path.join(pathToTranslationsDir, lang);
        if (lang.length === 2 && fs.statSync(localeDir).isDirectory()) {
            translationDir = path.resolve(path.join(pathToTranslationsDir, lang));

            const files = fs.readdirSync(translationDir);
            for (let idx in files) {
                let file = files[idx];

                if ( file === undefined || ! file.endsWith(".json")) continue;

                let dataJson = JSON.parse(fs.readFileSync(path.join(translationDir, file),"utf8"));

                for (const phrase in dataJson) {
                    if (translations[phrase] === undefined) {
                        translations[phrase] = {};
                    }
                    translations[phrase][lang] = dataJson[phrase];
                }
            }
        }
    }

    return translations;
}

let translationsJSON = JSON.stringify(getAllTranslations());
fs.writeFileSync("assets/translations.json", translationsJSON);
