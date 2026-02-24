<template>
    <div class="card-extra-content-container">
      <div v-if="lifeFound()" class="little-green-men" />
      <div v-if="isMiningTileOnSteel()" class="mined-metal mined-steel" />
      <div v-if="isMiningTileOnTitanium()" class="mined-metal mined-titanium" />
    </div>
</template>

<script setup lang="ts">
import {CardModel} from '@/common/models/CardModel';
import {CardName} from '@/common/cards/CardName';
import {Resource} from '@/common/Resource';

const props = defineProps<{
  card: CardModel;
}>();

function isMiningTileOnSteel() {
  return props.card.name !== CardName.SPECIALIZED_SETTLEMENT && props.card.bonusResource?.includes(Resource.STEEL);
}

function isMiningTileOnTitanium() {
  return props.card.name !== CardName.SPECIALIZED_SETTLEMENT && props.card.bonusResource?.includes(Resource.TITANIUM);
}

function lifeFound() {
  return props.card.name === CardName.SEARCH_FOR_LIFE && props.card.resources !== undefined && props.card.resources > 0;
}
</script>
