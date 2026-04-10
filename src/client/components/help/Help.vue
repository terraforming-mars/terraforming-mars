<template>
    <div class="help-container">

        <div class="help-tabs">

            <input type="radio" name="help-tab" id="radio-symbols" value="iconology" v-model="currentPage">
            <label for="radio-symbols">
                <span v-i18n>Game Iconology</span>
            </label>
            <input type="radio" name="help-tab" id="radio-standard-projects" value="standard-projects" v-model="currentPage">
            <label for="radio-standard-projects">
                <span v-i18n>Standard Projects</span>
            </label>

            <input type="radio" name="help-tab" id="radio-phases" value="phases" v-model="currentPage">
            <label for="radio-phases">
                <span v-i18n>Game Phases</span>
            </label>

            <input type="radio" name="help-tab" id="radio-hotkeys" value="hotkeys" v-model="currentPage">
            <label for="radio-hotkeys">
                <span v-i18n>Hot Keys</span>
            </label>

            <input type="radio" name="help-tab" id="radio-rulebooks" value="rulebooks" v-model="currentPage">
            <label for="radio-rulebooks">
                <span v-i18n>Rules</span>
            </label>
        </div>

        <HelpIconology v-if="isOpen('iconology')"></HelpIconology>
        <HelpStandardProjects v-if="isOpen('standard-projects')"></HelpStandardProjects>
        <HelpPhases v-if="isOpen('phases')"></HelpPhases>
        <HelpRulebooks v-if="isOpen('rulebooks')"></HelpRulebooks>
        <HelpHotkeys v-if="isOpen('hotkeys')"></HelpHotkeys>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import HelpIconology from '@/client/components/help/HelpIconology.vue';
import HelpPhases from '@/client/components/help/HelpPhases.vue';
import HelpHotkeys from '@/client/components/help/HelpHotkeys.vue';
import HelpRulebooks from '@/client/components/help/HelpRulebooks.vue';
import HelpStandardProjects from '@/client/components/help/HelpStandardProjects.vue';

const TABS = ['iconology', 'standard-projects', 'phases', 'hotkeys', 'rulebooks'] as const;
type Tab = typeof TABS[number];

export interface HelpPageModel {
    currentPage: Tab;
}

export default defineComponent({
  name: 'Help',
  data(): HelpPageModel {
    return {
      currentPage: 'iconology',
    };
  },
  components: {
    HelpIconology,
    HelpPhases,
    HelpRulebooks,
    HelpStandardProjects,
    HelpHotkeys,
  },
  mounted() {
    const hash = window.location.hash.replace('#', '') as Tab;

    if (TABS.includes(hash)) {
      this.currentPage = hash;
    }
  },
  watch: {
    currentPage(newTab: Tab) {
      window.location.hash = newTab;
    },
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
