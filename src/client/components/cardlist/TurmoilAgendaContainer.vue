<template>
  <div class="turmoil_agenda_item">
  <TurmoilAgenda :id="agendaId" />
  <div class="turmoil_agenda_line1">{{ agendaId }}</div>
  <div class="turmoil_agenda_line2">
    {{ $t(agenda.name) }} {{ $t(agenda.type) }} {{ agenda.num }}
  </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {agendaInfoById, AgendaInfo, BonusId, PolicyId} from '@/common/turmoil/Types';
import TurmoilAgenda from '@/client/components/turmoil/TurmoilAgenda.vue';


const props = defineProps({
  agendaId: {
    type: String as () => BonusId | PolicyId,
    required: true,
  },
});

const agenda = computed<AgendaInfo>(() => agendaInfoById(props.agendaId));
</script>

<style scoped lang="less">
.turmoil_agenda_item {
  padding: 12px;
  background-image: linear-gradient(#9c602d, #25170a);
  border-radius: 8px;
  height: 120px;
  width: 250px;
  margin: 0 5px;

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
  }

  .turmoil_agenda_line1, .turmoil_agenda_line2 {
    text-align: center;
    font-size: 18px;
  }
}
</style>
