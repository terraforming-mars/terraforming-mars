<script lang="ts">
import Vue from 'vue';

import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {LANGUAGES} from '@/common/constants';

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
    LANGUAGES(): typeof LANGUAGES {
      return LANGUAGES;
    },
  },
});
</script>

<template>
  <div class="preferences_panel">
    <div class="preferences_panel_item form-group">
      <div class="preferences_panel_langs">
        <label class="form-radio" v-for="lang in LANGUAGES" :key="lang.id">
          <div
            :key="lang.id"
            :class="`language-icon language-icon--${lang.id}`"
            :title="lang.title"
            @click="switchLanguageTo(lang.id)"
          />
          {{ lang.title }}
        </label>
      </div>
    </div>
  </div>
</template>
