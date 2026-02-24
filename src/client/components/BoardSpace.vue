<template>
  <div v-if="space !== undefined" :class="mainClass" :data_space_id="space.id">
    <board-space-tile
      :space="space"
      :aresExtension="aresExtension"
      :tileView="tileView"
    ></board-space-tile>
    <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
    <bonus :bonus="space.bonus" v-if="showBonus"></bonus>
    <template v-if="tileView === 'coords'">
      <div class="board-space-coords">{{ getSpaceName(space.id) }}</div>
    </template>
    <template v-if="tileView === 'show'">
      <div :class="playerColorCss" v-if="space.color !== undefined"></div>
      <template v-if="space.gagarin !== undefined">
        <div v-if="space.gagarin === 0" class='gagarin'></div>
        <div v-else class='gagarin visited'></div>
      </template>
      <template v-if="space.cathedral === true">
        <div class='board-cube--cathedral'></div>
      </template>
      <template v-if="space.nomads === true">
        <div class='board-cube--nomad'></div>
      </template>
      <underground-token v-if="claimedToken !== undefined" :token="claimedToken" location="board"></underground-token>
      <div v-if="space.excavator !== undefined" class="underground-excavator" :class="'underground-excavator--' + space.excavator"></div>
      <div v-if="space.spaceType === SpaceType.DEFLECTION_ZONE" class="board-space-type-deflection-zone"></div>
    </template>
    <div class="board-log-highlight" :data_log_highlight_id="space.id"></div>
    </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import Bonus from '@/client/components/Bonus.vue';
import BoardSpaceTile from '@/client/components/board/BoardSpaceTile.vue';
import UndergroundToken from '@/client/components/underworld/UndergroundToken.vue';
import {TileView} from '@/client/components/board/TileView';
import {SpaceModel} from '@/common/models/SpaceModel';
import {getPreferences} from '../utils/PreferencesManager';
import {ClaimedToken} from '@/common/underworld/UnderworldPlayerData';
import {getSpaceName} from '@/common/boards/spaces';
import {SpaceType} from '@/common/boards/SpaceType';

const props = withDefaults(defineProps<{
  space: SpaceModel;
  text?: string;
  aresExtension?: boolean;
  tileView: TileView;
}>(), {
  text: '',
});

const mainClass = computed((): string => {
  let css = 'board-space board-space-' + props.space?.id.toString();
  css += ' board-space-selectable';
  return css;
});

const showBonus = computed((): boolean => {
  return props.space.tileType === undefined || props.tileView === 'hide';
});

const playerColorCss = computed((): string => {
  if (props.space.color === undefined) {
    return '';
  }
  const css = 'board-cube board-cube--' + props.space.color;
  return getPreferences().symbol_overlay ? css + ' overlay' : css;
});

const claimedToken = computed((): ClaimedToken | undefined => {
  if (props.space.undergroundResource === undefined) {
    return undefined;
  }
  return {token: props.space.undergroundResource, shelter: false, active: false};
});
</script>
