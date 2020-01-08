
import Vue from "vue";

import { SpaceModel } from "../models/SpaceModel";

import {Bonus} from "./Bonus";
import {Tile} from "./Tile";
import { Venus } from "./Venus";
import { BoardMixin } from "./BoardMixin";

export const Board = Vue.component("board", {
    props: ["spaces", "venusNextExtension", "venusScaleLevel"],
    components: {
        "bonus": Bonus,
        "tile": Tile,
        "venus": Venus
    },
    data: function () {
        return {}
    },
    mixins: [BoardMixin],
    methods: {
        getSpacesWithBonus: function(): Array<SpaceModel> {
            const boardSpaces: Array<SpaceModel> = this.spaces.filter((space: SpaceModel) => space.bonus.length > 0);
            boardSpaces.sort((s1: any, s2: any) => {return s1.id - s2.id});
            return boardSpaces;
        },
        getAllSpaces: function(): Array<SpaceModel> {
            const boardSpaces: Array<SpaceModel> = this.spaces;
            boardSpaces.sort((s1: any, s2: any) => {return s1.id - s2.id});
            return boardSpaces;
        },
        getMainSpaces: function (): Array<SpaceModel> {
            return this.getAllSpaces().filter((s) => {return parseInt(s.id) < 70})
        }, 
        getVenusSpaces: function (): Array<SpaceModel> {
            return this.getAllSpaces().filter((s) => {return parseInt(s.id) >= 70})
        }
    },
    template: `
    <div class="board_cont">
        <div class="board" id="main_board">
            <bonus v-for="space in getSpacesWithBonus()" :space="space" :key="getKey('bonus', space)"></bonus>
            <tile v-for="space in getSpacesWithTile()" :space="space" :key="getKey('tile', space)"></tile>
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
                <g transform="translate(1, 1)" id="main_grid">
                    <use v-for="space in getMainSpaces()"
                        v-if="space.tileType === undefined"
                        :data_space_id="space.id" 
                        class="board_space" 
                        :class="getPosCssClass(space)" 
                        :stroke="getStroke(space)" 
                        xlink:href="#hexagon" />
                </g>
            </svg>

            <svg id="board_legend" height="470" width="450" class="board_legend">

                <g id="ganymede_colony">
                    <text x="67" y="462" class="board_caption">Ganymede colony</text>
                </g>

                <g id="phobos_space_heaven">
                    <text x="2" y="15" class="board_caption">Phobos space haven</text>
                </g>
                <g id="ascraeus_mons" transform="translate(40, 120)">
                    <text class="board_caption">
                        <tspan dy="15">Ascraeus</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>
                
                <g id="pavonis_mons" transform="translate(15, 160)">
                    <text class="board_caption">
                        <tspan dy="15">Pavonis</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>
                
                <g id="arsia_mons" transform="translate(2, 205)">
                    <text class="board_caption">
                        <tspan dy="15">Arsia</tspan>
                        <tspan x="-2" dy="12">Mons</tspan>
                    </text>
                </g>
                
                <g id="tharsis_tholus"  transform="translate(10, 100)">
                    <text class="board_caption">Tharsis Tholus</text>
                    <line x1="85" y1="-3" x2="160" y2="2" class="board_line"></line>
                    <text x="158" y="5" class="board_caption board_caption--black">&#x25cf;</text>
                </g>
                
                <g id="noctis_city" transform="translate(10, 258)">
                    <text class="board_caption">
                        <tspan dy="15">Noctis</tspan>
                        <tspan x="7" dy="12">City</tspan>
                    </text>
                    <line x1="30" y1="20" x2="140" y2="-20" class="board_line"></line>
                    <text x="136" y="-18" class="board_caption board_caption--black">&#x25cf;</text>
                </g>
            </svg>
        </div>

        <venus v-if="venusNextExtension" :spaces="getVenusSpaces()" :venusScaleLevel="venusScaleLevel"></venus>
    </div>
    `
});


