
import { PreferencesManager } from "../components/PreferencesManager";
import * as raw_translations from "../../assets/translations.json";

let TM_translations: any = raw_translations;

export function translateText(englishText: string): string {
    let translatedText = englishText;
    if (TM_translations === undefined) return translatedText; 
    const lang = PreferencesManager.loadValue("lang") || "en";
    if (lang === "en") return englishText;

    englishText = normalizeText(englishText);

    if (TM_translations[lang][englishText]) {
        translatedText = TM_translations[lang][englishText]
    } else {
        let stripedText = englishText.replace(/^\(|\)$/gm, "");
        if (stripedText && stripedText !== englishText) {
            stripedText = translateText(stripedText);
            if (stripedText !== englishText) {
                translatedText = "(" + stripedText + ")";
            }
        } else if (stripedText && stripedText.length > 3) {
            console.log("Please translate \"" + stripedText + "\"")
        }
    }
    return translatedText;
}

function normalizeText(text: string): string {
    text = text.replace(/[\n\r]/g, "").replace(/[ ]+/g, " ");
    return text.trim()
}

function translateChildren(node: any) {
    if (node.childNodes)
    for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            var translatedText = translateText(child.data);
            if (translatedText !== child.data) {
                child.data = translatedText;
            }
        } else {
            translateChildren(child);
        }
    }
}

export function translateTextNode(el: any) {
    const lang = PreferencesManager.loadValue("lang") || "en";
    if (TM_translations === undefined) return;
    if (TM_translations[lang] === undefined) return;

    translateChildren(el);
}

export const $t = translateText;
