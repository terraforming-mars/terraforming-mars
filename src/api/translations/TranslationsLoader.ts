import * as fs from 'fs';
import * as path from 'path';
import { ALL_LANGUAGES } from "./Language"

export function getAllTranslations(): Record<string, Record<string, string>> {
    let pathToTranslationsDir = path.resolve("src/locales")
    let translations: Record<string, Record<string, string>> = {};
    let translationDir: string = "";

    console.error(pathToTranslationsDir);
    for (let idx in ALL_LANGUAGES) {
        let lang: string = ALL_LANGUAGES[idx];
        translationDir = path.resolve(path.join(pathToTranslationsDir, lang));

        if ( ! fs.existsSync(translationDir)) continue;
        
        translations[lang] = {};

        let files = fs.readdirSync(translationDir);
        for (let idx in files) {
            let file = files[idx];

            if ( file === undefined || ! file.endsWith(".json")) continue;

            let dataJson = JSON.parse(fs.readFileSync(path.join(translationDir, file),"utf8"));
            
            for (let k in dataJson) {
                translations[lang][k] = dataJson[k];
            }
        }

    }
    return translations;
}