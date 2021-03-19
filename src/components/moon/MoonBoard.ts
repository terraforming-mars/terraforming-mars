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
        <moon-space :space="getSpaceById('m01')" text="Luna Space Station"></moon-space>
        <moon-space :space="getSpaceById('m37')" text="Momentum Virium Habitat"></moon-space>
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
      </div>
    </div>
    `,
});
