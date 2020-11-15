import Vue from 'vue';
import {LanguageSwitcher} from './LanguageSwitcher';

import * as raw_settings from '../../assets/settings.json';

export const StartScreen = Vue.component('start-screen', {
  props: {
    version: {
      type: String as () => typeof raw_settings.version,
    },
  },
  components: {
    LanguageSwitcher,
  },
  methods: {
  },
  template: `
<div class="start-screen">
  <div v-i18n class="start-screen-links">
    <div class="start-screen-header start-screen-link--title">
      <div class="start-screen-title-top">TERRAFORMING</div>
      <div class="start-screen-title-bottom">MARS</div>
    </div>
    <a class="start-screen-link start-screen-link--new-game" href="/new-game" v-i18n>New game</a>
    <a class="start-screen-link start-screen-link--solo" href="/solo" v-i18n>Solo challenge</a>
    <a class="start-screen-link start-screen-link--cards-list" href="https://ssimeonoff.github.io/cards-list" target="_blank" v-i18n>Cards list</a>
    <a class="start-screen-link start-screen-link--board-game" href="https://boardgamegeek.com/boardgame/167791/terraforming-mars" target="_blank" v-i18n>Board game</a>
    <a class="start-screen-link start-screen-link--about" href="https://github.com/bafolts/terraforming-mars" target="_blank" v-i18n>About us</a>
    <a class="start-screen-link start-screen-link--changelog" href="https://github.com/bafolts/terraforming-mars/wiki/Changelog" target="_blank" v-i18n>Whats new?</a>
    <a class="start-screen-link start-screen-link--chat" href="https://discord.gg/fWXE53K" target="_blank" v-i18n>Join us on Discord</a>
    <div class="start-screen-header start-screen-link--languages">
      <language-switcher />
      <div class="start-version">version: {{version}}</div>
    </div>
  </div>
</div>`,
});
