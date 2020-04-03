import Vue from "vue";

export const StartScreen = Vue.component("start-screen", {
    template: `
        <div class="start-screen">
            <h1 class="start-screen-game-title" v18n>Terraforming Mars</h1>

            <div class="start-screen-links">
                <a class="start-screen-link start-screen-link--new-game" href="/new-game" i18n>New game</a>
                <a class="start-screen-link start-screen-link--solo" href="/solo" i18n>Solo challenge</a>
                <a class="start-screen-link start-screen-link--cards-list" href="https://ssimeonoff.github.io/cards-list" i18n>Cards list</a>
                <a class="start-screen-link start-screen-link--board-game" href="https://boardgamegeek.com/boardgame/167791/terraforming-mars" i18n>Board game</a>
                <a class="start-screen-link start-screen-link--about" href="https://github.com/bafolts/terraforming-mars" i18n>About us</a>
                <a class="start-screen-link start-screen-link--changelog" href="https://github.com/bafolts/terraforming-mars/wiki/Changelog" i18n>Whats new?</a>
            </div>
        </div>
    `
});