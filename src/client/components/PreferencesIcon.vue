<template>
  <div class="sidebar_item sidebar_item--settings" :title="$t('Player Settings')">
    <i class="sidebar_icon sidebar_icon--settings" :class="{'sidebar_item--is-active': preferencesPanelOpen}" v-on:click="preferencesPanelOpen = !preferencesPanelOpen"></i>
    <preferences-dialog v-show="preferencesPanelOpen" @okButtonClicked="preferencesPanelOpen = false" :preferencesManager="preferencesManager"/>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import PreferencesDialog from '@/client/components/PreferencesDialog.vue';

export default Vue.extend({
  name: 'PreferencesIcon',
  components: {
    'preferences-dialog': PreferencesDialog,
  },
  data() {
    return {
      preferencesPanelOpen: false,
    };
  },
  computed: {
    preferencesManager(): PreferencesManager {
      return PreferencesManager.INSTANCE;
    },
  },
});

</script>
