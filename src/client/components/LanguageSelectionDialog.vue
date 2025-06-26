<template>
  <div class="preferences_panel">
    <div class="preferences_panel_item form-group">
      <div class="preferences_panel_langs">
        <label class="form-radio" v-for="lang in ALL_LANGUAGES" :key="lang">
          <div
            :key="lang"
            :class="`language-icon language-icon-for-switcher language-icon--${lang}`"
            :title="LANGUAGES[lang][1]"
            @click="switchLanguageTo(lang)"
          />
          <span class="language-text" @click="switchLanguageTo(lang)">{{ LANGUAGES[lang] }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {ALL_LANGUAGES, LANGUAGES} from '@/common/constants';

export default Vue.extend({
  name: 'LanguageSelectionDialog',
  props: {
    preferencesManager: {
      type: Object as () => PreferencesManager,
    },
  },
  methods: {
    switchLanguageTo(langId: string) {
      this.preferencesManager.set('lang', langId);
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
