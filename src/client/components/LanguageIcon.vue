<template>
  <div ref="root" class="sidebar-item sidebar-item--language" :title="$t('Language')">
    <div
      class="sidebar-icon sidebar-icon--language"
      :class="{'sidebar-item--is-active': languagePanelOpen}">
      <div :class="`language-icon language-icon-for-sidebar language-icon--${lang}`"
        :title="title"
        @click="languagePanelOpen = !languagePanelOpen"></div>
    </div>
    <LanguageSelectionDialog v-show="languagePanelOpen" :preferencesManager="PreferencesManager.INSTANCE" />
  </div>
</template>

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import LanguageSelectionDialog from '@/client/components/LanguageSelectionDialog.vue';
import {LANGUAGES} from '@/common/constants';

const root = ref<HTMLElement>();
const languagePanelOpen = ref(false);
const lang = computed(() => PreferencesManager.INSTANCE.values().lang as keyof typeof LANGUAGES);
const title = computed(() => {
  const language = LANGUAGES[lang.value];
  return `${language[0]} (${language[1]})`;
});

function closeOnOutsideClick(event: MouseEvent) {
  if (languagePanelOpen.value && event.target instanceof Node && root.value?.contains(event.target) === false) {
    languagePanelOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick));
</script>
