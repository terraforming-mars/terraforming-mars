<template>
  <div ref="root" class="sidebar_item sidebar_item--settings">
    <i class="sidebar_icon sidebar_icon--settings" :title="$t('Player Settings')" :class="{'sidebar_item--is-active': preferencesPanelOpen}" @click="preferencesPanelOpen = !preferencesPanelOpen"></i>
    <PreferencesDialog v-show="preferencesPanelOpen" @okButtonClicked="preferencesPanelOpen = false" :preferencesManager="PreferencesManager.INSTANCE"/>
  </div>
</template>

<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from 'vue';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import PreferencesDialog from '@/client/components/PreferencesDialog.vue';

const root = ref<HTMLElement>();
const preferencesPanelOpen = ref(false);

function closeOnOutsideClick(event: MouseEvent) {
  if (preferencesPanelOpen.value && event.target instanceof Node && root.value?.contains(event.target) === false) {
    preferencesPanelOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick));

</script>
