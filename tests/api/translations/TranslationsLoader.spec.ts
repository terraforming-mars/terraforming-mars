import { expect } from "chai";
import { getAllTranslations } from "../../../src/api/translations/TranslationsLoader";

describe("TranslationsLoader", function () {

    it("Loads all translations", function () {
        let translations = getAllTranslations();
        let ruLang = translations["ru"];
        if (ruLang === undefined) return;
        expect(ruLang["Terraforming Mars"]).to.eq("Покорение Марса");
    });

});