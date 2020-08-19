import Vue from "vue";
import {LanguageSwitcher} from "./LanguageSwitcher";

export const StartScreen = Vue.component("start-screen", {
    components: {
        LanguageSwitcher
    },
    template: `
        <div class="start-screen">
            <h1 class="start-screen-game-title" v-i18n>Terraforming Mars</h1>
            <div class="start-screen-lang-switch">
                <language-switcher></language-switcher>
            </div>

            <div class="start-screen-links">
                <a class="start-screen-link start-screen-link--new-game" href="/new-game" v-i18n>New game</a>
                <a class="start-screen-link start-screen-link--solo" href="/solo" v-i18n>Solo challenge</a>
                <a class="start-screen-link start-screen-link--cards-list" href="https://ssimeonoff.github.io/cards-list" v-i18n>Cards list</a>
                <a class="start-screen-link start-screen-link--board-game" href="https://boardgamegeek.com/boardgame/167791/terraforming-mars" v-i18n>Board game</a>
                <a class="start-screen-link start-screen-link--about" href="https://github.com/bafolts/terraforming-mars" v-i18n>About us</a>
                <a class="start-screen-link start-screen-link--changelog" href="https://github.com/bafolts/terraforming-mars/wiki/Changelog" v-i18n>Whats new?</a>
                <a class="start-screen-link start-screen-link--chat" href="https://discord.gg/fWXE53K" target="_blank" v-i18n>Join us on Discord</a>
            </div>
        </div>
    `
});