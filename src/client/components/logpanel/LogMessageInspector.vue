<template>
  <CardPanel v-if="selectedMessage !== undefined" :message="selectedMessage" :players="viewModel.players" @hide="selectedMessage = undefined"/>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {LogMessage} from '@/common/logs/LogMessage';
import {ViewModel} from '@/common/models/PlayerModel';
import CardPanel from '@/client/components/logpanel/CardPanel.vue';

defineProps<{
  viewModel: ViewModel;
}>();

const selectedMessage = ref<LogMessage | undefined>(undefined);

function show(message: LogMessage) {
  selectedMessage.value = message;
}

defineExpose({show});
</script>
