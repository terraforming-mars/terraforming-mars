<template>
  <div class="language-switcher">
    <template v-for="lang in LANGUAGES">
    <div
      :key="lang.id"
      :class="`language-icon language-icon--${lang.id} language-icon-for-switcher`"
      :title="lang.title"
      @click="switchLanguageTo(lang.id)"
    />
    &nbsp;
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {LANGUAGES} from '@/common/constants';
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
    LANGUAGES(): typeof LANGUAGES {
      return LANGUAGES;
    },
  },
});
</script>
