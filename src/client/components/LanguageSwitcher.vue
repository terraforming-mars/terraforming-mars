<template>
  <div class="language-switcher">
    <template v-for="lang in ALL_LANGUAGES">
    <div
      :key="lang"
      :class="`language-icon language-icon--${lang} language-icon-for-switcher`"
      :title="LANGUAGES[lang]"
      @click="switchLanguageTo(lang)"
    />
    &nbsp;
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

export default Vue.extend({
  name: 'language-switcher',
  methods: {
    switchLanguageTo(langId: string) {
      PreferencesManager.INSTANCE.set('lang', langId);
      window.location.reload();
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
