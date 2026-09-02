<template>
  <div class="language-switcher">
    <template v-for="lang in ALL_LANGUAGES" :key="lang">
    <div
      :class="[`language-icon language-icon--${lang} language-icon-for-switcher`, {'language-icon--selected': lang === currentLang}]"
      :data-title="title(lang)"
      @click="switchLanguageTo(lang)"
    ></div>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default defineComponent({
  name: 'LanguageSwitcher',
  methods: {
    reloadWindow() {
      window.location.reload();
    },
    switchLanguageTo(langId: string) {
      PreferencesManager.INSTANCE.set('lang', langId);
      this.reloadWindow();
    },
    title(key: keyof typeof LANGUAGES) {
      const lang = LANGUAGES[key];
      return `${lang[0]} (${lang[1]})`;
    },
  },
  computed: {
    currentLang(): string {
      return PreferencesManager.INSTANCE.values().lang;
    },
    ALL_LANGUAGES(): typeof ALL_LANGUAGES {
      return ALL_LANGUAGES;
    },
    LANGUAGES(): typeof LANGUAGES {
      return LANGUAGES;
    },
  },
});
</script>
