
import { PreferencesManager } from "../components/PreferencesManger";

export function translateText(englishText: string): string {
    let translatedText = englishText;
    if ((window as any).TM_translations === undefined) return translatedText; 
    const lang = PreferencesManager.loadValue("lang") || "en";
    if (lang === "en") return englishText;
    if ((window as any).TM_translations[lang][englishText]) {
        translatedText = (window as any).TM_translations[lang][englishText]
    }
    return translatedText;
}

function translateChildren(node: any) {
    if (node.childNodes)
    for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            var translatedText = translateText(child.data);
            if (translatedText !== child.data) {
                child.data = translateText(child.data);
            }
        } else {
            translateChildren(child);
        }
    }
}

export function translateTextNode(el: any) {
    const lang = PreferencesManager.loadValue("lang") || "en";
    if ((window as any).TM_translations === undefined) return;
    if ((window as any).TM_translations[lang] === undefined) return;

    translateChildren(el);
}

export const $t = translateText;
