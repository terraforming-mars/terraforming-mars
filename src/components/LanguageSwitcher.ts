import Vue from "vue";
import { LANGUAGES } from "../constants";
import { PreferencesManager } from "./PreferencesManager";

export const LanguageSwitcher = Vue.component("language-switcher", {
    data: function () { return {
        "languages": LANGUAGES
    }},
    methods: {
        switchLanguageTo: function (langId: string, reloadThePage: boolean = false) {
            PreferencesManager.saveValue("lang", langId);
            if (reloadThePage) window.location = window.location;
        }
    },
    template: `
        <div class="language-switcher">
            <div 
                v-for="lang in languages" 
                :class="'language-icon language-icon--'+lang.id" 
                :title="lang.title" 
                v-on:click="switchLanguageTo(lang.id, true)"></div>
        </div>
    `
});