<template>
  <div class="container">
  <div class="agenda-title"><CardParty :party="party" /><span>{{ agendaType }} {{ agenda.num }} <span class="small">{{ $t(agenda.name) }} {{ $t(agenda.type) }}</span></span></div>
  <TurmoilAgenda class="agenda" :id="agendaId" />
  <div class="description" v-i18n>{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {agendaInfoById, AgendaInfo, BonusId, PolicyId} from '@/common/turmoil/Types';
import {getAgendaOrThrow} from '@/client/turmoil/ClientAgendaManifest';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';
import CardParty from '@/client/components/card/CardParty.vue';
import {PartyName} from '@/common/turmoil/PartyName';

const props = defineProps({
  agendaId: {
    type: String as () => BonusId | PolicyId,
    required: true,
  },
});

const agenda = computed<AgendaInfo>(() => agendaInfoById(props.agendaId));
const description = computed<string>(() => getAgendaOrThrow(props.agendaId).description);
const party = computed<PartyName>(() => agenda.value.name);
const agendaType = computed<string>(() => agenda.value.type === 'Bonus' ? '⚡' : '⚖️');
</script>

<style scoped lang="less">
.container {
  padding: 12px;
  background-image: linear-gradient(#5c5c5c, #2a2a2a);
  border-radius: 8px;
  min-height: 120px;
  width: 250px;
  margin: 0 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  :deep(.policy-top-margin) {
    margin-top: 0 !important;
  }

  :deep(.scientists-requisite) {
    margin-top: 0 !important;
    margin-left: 80px !important;
  }

  .agenda {
    margin-bottom: auto;
    text-align: center;
    height: 50px;
  }

  .agenda-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 18px;
    color: white;
  }

  .small {
    font-size: 14px;
  }

  .description {
    text-align: center;
    font-size: 12px;
    line-height: 1.3;
    color: white;
  }
}
</style>
