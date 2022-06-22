<template>
    <div class="help-container">

        <div class="help-tabs">
            <input type="radio" name="help-tab" id="radio-symbols" checked>
            <label for="radio-symbols" v-on:click="setTab('iconology')">
                <span v-i18n>Game Iconology</span>
            </label>
            <input type="radio" name="help-tab" id="radio-standard-projects">
            <label for="radio-standard-projects" v-on:click="setTab('standard projects')">
                <span v-i18n>Standard Projects</span>
            </label>
            <input type="radio" name="help-tab" id="radio-phases">
            <label for="radio-phases" v-on:click="setTab('phases')">
                <span v-i18n>Game Phases</span>
            </label>
            <input type="radio" name="help-tab" id="radio-hotkeys">
            <label for="radio-hotkeys" v-on:click="setTab('hotkeys')">
                <span v-i18n>Hot Keys</span>
            </label>
        </div>

        <HelpIconology v-if="isOpen('iconology')"></HelpIconology>

        <HelpStandardProjects v-if="isOpen('standard projects')"></HelpStandardProjects>

        <HelpPhases v-if="isOpen('phases')"></HelpPhases>

        <div v-if="isOpen('hotkeys')">
          <div class="help-hotkeys">
            <div class="keys">
              <div v-i18n>Main Board</div>
              <div v-i18n>Players Overview Table</div>
              <div v-i18n>Cards in Hand</div>
              <div v-i18n>Colonies</div>
            </div>
          </div>
          <div class="help-hotkeys-example"></div>
        </div>

    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import HelpIconology from '@/client/components/help/HelpIconology.vue';
import HelpPhases from '@/client/components/help/HelpPhases.vue';
import HelpStandardProjects from '@/client/components/help/HelpStandardProjects.vue';

type Tab = 'iconology' | 'standard projects' | 'phases' | 'hotkeys';

export interface HelpPageModel {
    currentPage: Tab;
}

export default Vue.extend({
  name: 'Help',
  data(): HelpPageModel {
    return {
      currentPage: 'iconology',
    };
  },
  components: {
    HelpIconology,
    HelpStandardProjects,
    HelpPhases,
  },
  methods: {
    setTab(tab: Tab): void {
      this.currentPage = tab;
    },
    isOpen(tab: Tab): boolean {
      return tab === this.currentPage;
    },
  },

});
</script>
