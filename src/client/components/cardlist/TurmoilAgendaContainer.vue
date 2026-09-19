<template>
  <div class="container" @click="showDescription = !showDescription">
  <TurmoilAgenda :id="agendaId" :useRenderData="useRenderData" />
  <div class="line1">{{ agendaId }}</div>
  <div class="line2">
    {{ $t(agenda.name) }} {{ $t(agenda.type) }} {{ agenda.num }}
  </div>
  <div class="description" v-if="showDescription" v-i18n>{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {agendaInfoById, AgendaInfo, BonusId, PolicyId} from '@/common/turmoil/Types';
import {getAgendaOrThrow} from '@/client/turmoil/ClientAgendaManifest';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';


const props = defineProps({
  agendaId: {
    type: String as () => BonusId | PolicyId,
    required: true,
  },
  useRenderData: {
    type: Boolean,
    default: false,
  },
});

const agenda = computed<AgendaInfo>(() => agendaInfoById(props.agendaId));
const showDescription = ref(false);
const description = computed<string>(() => getAgendaOrThrow(props.agendaId).description);
</script>

<style scoped lang="less">
.container {
  padding: 12px;
  background-image: linear-gradient(#9c602d, #25170a);
  border-radius: 8px;
  min-height: 120px;
  width: 250px;
  margin: 0 5px;
  cursor: pointer;

  :deep(.policy-top-margin) {
    margin-top: 0 !important;
  }

  :deep(.scientists-requisite) {
    margin-top: 0 !important;
    margin-left: 80px !important;
  }

  > div:first-child {
    text-align: center;
    height: 50px;
    // Spectre sets `html {box-sizing: border-box}` with `* {box-sizing: inherit}`,
    // so box-sizing effectively cascades. The turmoil markup sizes its padded
    // tiles for content-box, which it gets on the board from `.turmoil`; without
    // it here, rb01/rb02's rating tiles collapse from 30x16 to 20x6.
    box-sizing: content-box;
  }

  .line1, .line2 {
    text-align: center;
    font-size: 18px;
  }

  .description {
    color: white;
    margin-top: 6px;
    text-align: center;
    font-size: 12px;
    line-height: 1.3;
  }
}
</style>
