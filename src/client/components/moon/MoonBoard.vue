<template>
  <!-- Is board-cont necessary? -->
  <div class="board-cont moon-board" id="moon_board">
    <svg id="moon_board_legend" height="550" width="630" class="board-legend">
      <g id="mare_imbrium" transform="translate(250, 40)">
        <text class="board-caption">
          <tspan dy="15">Mare</tspan>
          <tspan x="12" dy="12">Imbrium</tspan>
        </text>
        <line x1="24" y1="34" x2="33" y2="105" class="board-line"></line>
        <text x="30" y="107" class="board-caption board_caption--black">●</text>
      </g>

      <g id="mare_sereitatis" transform="translate(485, 140)">
        <text class="board-caption">
            <tspan dy="15">Mare</tspan>
            <tspan x="4" dy="12">Serenitatis</tspan>
        </text>
        <line x1="0" y1="25" x2="-120" y2="50" class="board-line"></line>
        <text x="-122" y="53" class="board-caption board_caption--black">●</text>
      </g>


      <g id="mare_nubium" transform="translate(195, 350)">
        <text class="board-caption">
          <tspan dy="15">Mare</tspan>
          <tspan x="-2" dy="12">Nubium</tspan>
        </text>
        <line x1="29" y1="14" x2="115" y2="-64" class="board-line"></line>
        <text x="113" y="-62" class="board-caption board_caption--black">●</text>
      </g>

      <g id="mare_nectaris" transform="translate(450, 300)">
        <text class="board-caption" dx="47">
          <tspan dy="15">Mare</tspan>
          <tspan dy="12" x="48">Nectaris</tspan>
        </text>
        <line x1="-39" y1="-12" x2="45" y2="15" class="board-line"></line>
        <text x="-39" y="-9" class="board-caption board_caption--black">&#x25cf;</text>
      </g>
    </svg>

    <div class="board-outer-spaces">
      <MoonSpace :space="getSpaceById('m01')" text="Luna Trade Station"></MoonSpace>
      <MoonSpace :space="getSpaceById('m37')" text="Momentum Virium Habitat"></MoonSpace>
    </div>

    <div class="global-numbers">
      <div class="global-numbers-habitat">
        <div :class="getScaleCSS(lvl)" v-for="(lvl, i) in getValuesForParameter('habitat')" :key="i">{{ lvl.strValue }}</div>
      </div>

      <div class="global-numbers-logistics">
        <div :class="getScaleCSS(lvl)" v-for="(lvl, i) in getValuesForParameter('logistics')" :key="i">{{ lvl.strValue }}</div>
      </div>

      <div class="global-numbers-mining">
        <div :class="getScaleCSS(lvl)" v-for="(lvl, i) in getValuesForParameter('mining')" :key="i">{{ lvl.strValue }}</div>
      </div>

    </div>

    <div class="board" id="moon_board">
      <MoonSpace
        v-for="space in getAllNonColonySpaces()"
        :key="space.id"
        :space="space"
        :tileView="tileView"
        data-test="moon-board-space"
      />
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import {MoonModel} from '@/common/models/MoonModel';
import {SpaceModel} from '@/common/models/SpaceModel';
import {SpaceType} from '@/common/boards/SpaceType';
import MoonSpace from '@/client/components/moon/MoonSpace.vue';
import {TileView} from '../board/TileView';
import {SpaceId} from '@/common/Types';

type MoonParamLevel = {
  value: number,
  isActive: boolean,
  strValue: string,
};

export default Vue.extend({
  name: 'MoonBoard',
  props: {
    model: {
      type: Object as () => MoonModel,
    },
    tileView: {
      type: String as () => TileView,
      default: 'show',
    },
  },
  components: {
    MoonSpace,
  },
  methods: {
    getAllNonColonySpaces(): Array<SpaceModel> {
      const boardSpaces: Array<SpaceModel> = [...this.model.spaces];
      boardSpaces.sort(
        (space1: SpaceModel, space2: SpaceModel) => {
          return parseInt(space1.id) - parseInt(space2.id);
        },
      );
      return boardSpaces.filter((s: SpaceModel) => {
        return s.spaceType !== SpaceType.COLONY;
      });
    },
    getSpaceById(spaceId: SpaceId) {
      for (const space of this.model.spaces) {
        if (space.id === spaceId) {
          return space;
        }
      }
      throw new Error('Board space not found by id \'' + spaceId + '\'');
    },
    getValuesForParameter(targetParameter: 'logistics' | 'mining' | 'habitat'): Array<MoonParamLevel> {
      let curValue: number;

      switch (targetParameter) {
      case 'logistics':
        curValue = this.model.logisticsRate;
        break;
      case 'mining':
        curValue = this.model.miningRate;
        break;
      case 'habitat':
        curValue = this.model.habitatRate;
        break;
      default:
        throw new Error('Wrong parameter to get values from: ' + targetParameter);
      }

      const values = [];
      for (let value = 8; value >= 0; value -= 1) {
        values.push({
          value: value,
          isActive: value === curValue,
          strValue: value.toString(),
        });
      }
      return values;
    },
    getScaleCSS(paramLevel: MoonParamLevel): string {
      let css = 'global-numbers-value val-' + paramLevel.value + ' ';
      if (paramLevel.value === 0) {
        css += 'zero-gap ';
      }
      if (paramLevel.isActive) {
        css += 'val-is-active';
      }
      return css;
    },
  },
});
</script>
