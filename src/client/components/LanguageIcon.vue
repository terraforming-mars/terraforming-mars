<template>
  <div class="sidebar_item sidebar_item--language" :title="$t('Language')">
    <div
      class="sidebar_icon sidebar_icon--language"
      :class="{'sidebar_item--is-active': languagePanelOpen}">
      <div :class="`language-icon language-icon-for-sidebar language-icon--${lang}`"
      :title="title"
      v-on:click="languagePanelOpen = !languagePanelOpen"/>
      </div>
    <language-selection-dialog v-show="languagePanelOpen" :preferencesManager="preferencesManager"/>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from 'vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import LanguageSelectionDialog from '@/client/components/LanguageSelectionDialog.vue';
import {LANGUAGES} from '@/common/constants';

const languagePanelOpen = ref(false);
const preferencesManager = computed(() => PreferencesManager.INSTANCE);
const lang = computed(() => preferencesManager.value.values().lang);
const title = computed(() => {
  const l = LANGUAGES[lang.value];
  return `${l[0]} (${l[1]})`;
});
</script>
