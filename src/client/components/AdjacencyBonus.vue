<template>
  <div :class="positionClass">
    <i v-for="(suffix, idx) in bonus" :key="idx" :class="`adjacency-bonus board-space-bonus--${suffix}`"></i>
  </div>
</template>

<script setup lang="ts">
import {computed, ComputedRef} from 'vue';
import {TileType} from '@/common/TileType';

const tileToSuffix: Partial<Record<TileType, Array<string>>> = {
  [TileType.BIOFERTILIZER_FACILITY]: ['plant', 'microbe'],
  [TileType.CAPITAL]: ['2mc'],
  [TileType.COMMERCIAL_DISTRICT]: ['2mc'],
  [TileType.DEIMOS_DOWN]: ['asteroid', 'steel'],
  [TileType.ECOLOGICAL_ZONE]: ['animal'],
  [TileType.GREAT_DAM]: ['energy', 'energy'],
  [TileType.INDUSTRIAL_CENTER]: ['steel'],
  [TileType.LAVA_FLOWS]: ['heat', 'heat'],
  [TileType.MAGNETIC_FIELD_GENERATORS]: ['plant', 'microbe'],
  [TileType.METALLIC_ASTEROID]: ['titanium'],
  [TileType.MINING_STEEL_BONUS]: ['steel'],
  [TileType.MINING_TITANIUM_BONUS]: ['titanium'],
  [TileType.MOHOLE_AREA]: ['heat', 'heat'],
  [TileType.NATURAL_PRESERVE]: ['megacredit'],
  [TileType.NUCLEAR_ZONE]: ['lose2mc'],
  [TileType.OCEAN_FARM]: ['plant'],
  [TileType.OCEAN_SANCTUARY]: ['animal'],
  [TileType.OCEAN_CITY]: ['city'],
  [TileType.RESTRICTED_AREA]: ['card'],
  [TileType.SOLAR_FARM]: ['energy', 'energy'],
};


const props = defineProps<{
  tileType: TileType;
}>();

const bonus: ComputedRef<Array<string>> = computed(() => {
  return tileToSuffix[props.tileType] ?? [];
});

const positionClass = computed(() => {
  let modifier = '';
  if (bonus.value.includes('lose2mc')) {
    modifier = ' lose2mc';
  } else if (bonus.value.includes('city')) {
    modifier = ' city';
  }
  return `adjacency-bonuses width--${bonus.value.length}${modifier}`;
});
</script>

<style scoped lang="less">
.adjacency-bonuses {
  position: absolute;
  display: flex;
  border: 1px solid @adjacency-bonus;

  &.lose2mc {
    border-color: @adjacency-cost;
  }

  &.city {
    border: none;
  }

  &.width--1 {
    margin: 7px 0 0 14px;
  }


  &.width--2 {
    margin: 7px 0 0 6px;
  }
}

.adjacency-bonus {
  pointer-events: none;
  width: 16px;
  height: 16px;
  background-size: 16px;
  border-radius: 1px;

  &.board-space-bonus--city {
    background: url(./assets/tiles/city.png) no-repeat;
    background-size: 16px;
  }
  // A card is portrait, so keep it 16px tall but narrower than it is square.
  &.board-space-bonus--card {
    width: 11px;
    height: 16px;
    background-size: auto 16px;
  }
}
</style>
