import Vue from "vue";
import * as constants from "../constants";
import { BoardMixin } from "./BoardMixin";
import { SpaceModel } from "../models/SpaceModel";
import { Tile } from "./Tile";

class VenusScaleLevel {
    constructor(public value: number, public isActive: boolean = false) {

    }
}

export const Venus = Vue.component("venus", {
    props: ["spaces", "venusScaleLevel"],
    components: {
        "tile": Tile
    },
    data: function () {
        return {}
    },
    mixins: [BoardMixin],
    methods: {
        getVenusScaleLevels: function(): Array<VenusScaleLevel> {
            let levels = new Array<VenusScaleLevel>();
            for (let value: number = 0; value <= constants.MAX_VENUS_SCALE; value += 2) {
                levels.push(
                    new VenusScaleLevel(value, value <= this.venusScaleLevel)
                )
            }
            return levels.reverse();
        },
        getScaleLevelCSS: function (level: VenusScaleLevel): string {
            return level.isActive ? "scale_figure--active" : ""
        },
        getVenusSpacesWithTile: function (): Array<SpaceModel> {
            const boardSpaces: Array<SpaceModel> = (this as any).spaces.filter(
                (space: SpaceModel) => (space.tileType != undefined || space.color != undefined) && parseInt(space.id) >= 70
            );
            boardSpaces.sort((s1: any, s2: any) => {return s1.id - s2.id});
            return boardSpaces;
        }
    },
    template: `
    <div class="venus_board_cont">
        <div class="venus_board">
            <div class="venus_board_scale_cont">
                <div class="scale_item" v-for="lvl in getVenusScaleLevels()">
                    <div class="scale_figure" :class="getScaleLevelCSS(lvl)"></div>
                    <div class="scale_value">{{ lvl.value }}</div>
                </div>
            </div>
            <i class="venus_img"></i>
            <p class="venus_board_legend venus_board_legend--luna">Luna Metropolis</p>
            <p class="venus_board_legend venus_board_legend--dawncity">Dawn City</p>
            <p class="venus_board_legend venus_board_legend--maxwell">Maxwell Base</p>
            <p class="venus_board_legend venus_board_legend--stratopolis">Stratopolis</p>
            <tile v-for="space in getVenusSpacesWithTile()" :space="space" :key="getKey('tile', space)"></tile>
            <svg height="470" width="450">
                <defs>
                    <symbol id="hexagon">
                        <polygon points="24,48.5 45.3,36.5 45.3,13.5 24,2 3.5,13.5 3.5,36.5" fill="#fff" fill-opacity="0.01" stroke-width="3" stroke-opacity="0.4" />
                        <polygon style="visibility: var(--board_space_visibility, hidden)" transform="scale(0.9, 0.9) translate(3, 3)" points="24,48.5 45.3,36.5 45.3,13.5 24,2 3.5,13.5 3.5,36.5" fill="none" stroke="#4f4" stroke-width="4" stroke-opacity="0.4">
                            <animate
                                attributeType="XML"
                                attributeName="stroke"
                                values="#e95c2e;#f9c4b3;#e95c2e;#e95c2e"
                                dur="1.2s"
                                repeatCount="indefinite"/>
                        </polygon>
                    </symbol>
                </defs>
                <g transform="translate(1, 1)">
                    <use v-for="space in spaces"
                        v-if="space.tileType === undefined"
                        :data_space_id="space.id" 
                        class="board_space" 
                        :class="getPosCssClass(space)" 
                        :stroke="getStroke(space)" 
                        xlink:href="#hexagon" />
                </g>
            </svg>
        </div>
    </div>
    `
});