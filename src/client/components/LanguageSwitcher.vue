<template>
  <div class="language-switcher">
    <template v-for="lang in ALL_LANGUAGES">
    <div
      :key="lang"
      :class="`language-icon language-icon--${lang} language-icon-for-switcher`"
      :title="title(lang)"
      @click="switchLanguageTo(lang)"
    />
    &nbsp;
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent} from '@/client/vue3-compat';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default defineComponent({
  name: 'language-switcher',
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
    ALL_LANGUAGES(): typeof ALL_LANGUAGES {
      return ALL_LANGUAGES;
    },
    LANGUAGES(): typeof LANGUAGES {
      return LANGUAGES;
    },
  },
});
</script>
