import Vue from 'vue';
import {MoonModel} from '../../models/MoonModel';

import {SpaceModel} from '../../models/SpaceModel';
import {SpaceType} from '../../SpaceType';
import {MoonSpace} from './MoonSpace';

class MoonParamLevel {
  constructor(public value: number, public isActive: boolean, public strValue: string) {
  }
}

export const MoonBoard = Vue.component('moonboard', {
  props: {
    model: {
      type: Object as () => MoonModel,
    },
  },
  components: {
    'moon-space': MoonSpace,
  },
  data: function() {
    return {
    };
  },
  methods: {
    getAllNonColonySpaces: function(): Array<SpaceModel> {
      const boardSpaces: Array<SpaceModel> = this.model.spaces;
      boardSpaces.sort(
        (space1: SpaceModel, space2: SpaceModel) => {
          return parseInt(space1.id) - parseInt(space2.id);
        },
      );
      return boardSpaces.filter((s: SpaceModel) => {
        return s.spaceType !== SpaceType.COLONY;
      });
    },
    getSpaceById: function(spaceId: string) {
      for (const space of this.model.spaces) {
        if (space.id === spaceId) {
          return space;
        }
      }
      throw 'Board space not found by id \'' + spaceId + '\'';
    },
    getValuesForParameter: function(targetParameter: string): Array<MoonParamLevel> {
      let curValue: number;

      switch (targetParameter) {
      case 'logistics':
        curValue = this.model.logisticsRate;
        break;
      case 'mining':
        curValue = this.model.miningRate;
        break;
      case 'colony':
        curValue = this.model.colonyRate;
        break;
      default:
        throw 'Wrong parameter to get values from';
      }

      console.log(`parameter ${targetParameter}, value ${curValue}`);

      const values: Array<MoonParamLevel> = [];
      for (let value: number = 8; value >= 0; value -= 1) {
        const strValue = value.toString();
        values.push(
          new MoonParamLevel(value, value === curValue, strValue),
        );
      }
      return values;
    },
    getScaleCSS: function(paramLevel: MoonParamLevel): string {
      let css = 'global-numbers-value val-' + paramLevel.value + ' ';
      if (paramLevel.isActive) {
        css += 'val-is-active';
      }
      return css;
    },
  },
  // Do I need board-cont?
  template: `
    <div class="board-cont moon-board" id="moon_board">
        <div class="board-outer-spaces">
          <moon-space :space="getSpaceById('m01')" text="Luna Space Station"></moon-space>
          <moon-space :space="getSpaceById('m21')" text="Momentum Virium Habitat"></moon-space>
        </div>

        <div class="global-numbers">
            <div class="global-numbers-colony">
              <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('colony')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-logistics">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('logistics')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-mining">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('mining')">{{ lvl.strValue }}</div>
            </div>

        </div>

        <div class="board" id="moon_board">
            <moon-space :space="curSpace" :is_selectable="true" :key="'moon-space-'+curSpace.id" v-for="curSpace in getAllNonColonySpaces()"></moon-space>
            <svg id="board_legend" height="550" width="630" class="board-legend">
            </svg>
        </div>
    </div>
    `,
});
