import Vue from 'vue';
import {HelpSymbols} from './HelpSymbols';
import {HelpStandardProjects} from './HelpStandardProjects';
import {HelpPhases} from './HelpPhases';

enum HelpPageTab {
    Symbols = 'symbols',
    StandardProjects = 'standard projects',
    Phases = 'phases',
    HotKeys = 'hotkeys',
}

export interface HelpPageModel {
    currentPage: string;
}

export const HelpPage = Vue.component('help-page', {
  data: function(): HelpPageModel {
    return {
      currentPage: HelpPageTab.Symbols,
    };
  },
  components: {
    'help-symbols': HelpSymbols,
    'help-standard-projects': HelpStandardProjects,
    'help-phases': HelpPhases,
  },
  methods: {
    setTab: function(tab: string): void {
      switch (tab) {
      case ('symbols'):
        this.currentPage = HelpPageTab.Symbols;
        break;
      case ('standard'):
        this.currentPage = HelpPageTab.StandardProjects;
        break;
      case ('phases'):
        this.currentPage = HelpPageTab.Phases;
        break;
      case ('hotkeys'):
        this.currentPage = HelpPageTab.HotKeys;
        break;
      }
    },
    isTabOpen: function(tab: string): boolean {
      switch (tab) {
      case ('symbols'):
        return this.currentPage === HelpPageTab.Symbols;
      case ('standard'):
        return this.currentPage === HelpPageTab.StandardProjects;
      case ('phases'):
        return this.currentPage === HelpPageTab.Phases;
      case ('hotkeys'):
        return this.currentPage === HelpPageTab.HotKeys;
      default:
        return false;
      }
    },
  },
  template: `
    <div class="help-page-container">

        <div class="help-topics">
            <input type="radio" name="help-page-tab" id="radio-symbols">
            <label for="radio-symbols" v-on:click="setTab('symbols')">
                <span v-i18n>Game Symbols</span>
            </label>

            <input type="radio" name="help-page-tab" id="radio-standard-projects">
            <label for="radio-standard-projects" v-on:click="setTab('standard')">
                <span v-i18n>Standard Projects</span>
            </label>

            <input type="radio" name="help-page-tab" id="radio-phases">
            <label for="radio-phases" v-on:click="setTab('phases')">
                <span v-i18n>Game Phases</span>
            </label>

            <input type="radio" name="help-page-tab" id="radio-hotkeys">
            <label for="radio-hotkeys" v-on:click="setTab('hotkeys')">
                <span v-i18n>Hot Keys</span>
            </label>
        </div>

        <help-symbols v-if="isTabOpen('symbols')"></help-symbols>
        <help-standard-projects v-if="isTabOpen('standard')"></help-standard-projects>
        <help-phases v-if="isTabOpen('phases')"></help-phases>
        <div v-if="isTabOpen('hotkeys')">
          <div class="help-page-hotkeys">
            <div class="keys">
              <div v-i18n>Main Board</div>
              <div v-i18n>Players Overview Table</div>
              <div v-i18n>Cards in Hand</div>
              <div v-i18n>Colonies</div>
            </div>
          </div>
          <div class="help-page-hotkeys-example"></div>
        </div>

    </div>
    `,
});


