import { expect } from "chai";
import { getAllTranslations } from "../../../src/api/translations/TranslationsLoader";

describe("TranslationsLoader", function () {

    it("Loads all translations", function () {
        let translations = getAllTranslations();
        let ruLang = translations.get("ru");
        if (ruLang === undefined) return;
        expect(ruLang.get("Terraforming Mars")).to.eq("Покорение Марса");
    });

});