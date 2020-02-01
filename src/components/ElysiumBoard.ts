
import Vue from "vue";

import {Bonus} from "./Bonus";
import {Tile} from "./Tile";
import { Venus } from "./Venus";
import { BoardMixin } from "./BoardMixin";

export const ElysiumBoard = Vue.component("board", {
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
    template: `
    <div class="board_cont">
        <div class="board" id="main_board">
            <tile v-for="space in getSpacesWithTile()" :space="space" :key="getKey('tile', space)"></tile>
            <bonus v-for="space in getSpacesWithBonus(spaces)" :space="space" :key="getKey('bonus', space)"></bonus>
            <svg height="470" width="450">
                <defs>
                    <symbol id="hexagon">
                        <polygon points="24,48.5 45.3,36.5 45.3,13.5 24,2 3.5,13.5 3.5,36.5" fill="#fff" fill-opacity="0.01" stroke-width="3" stroke-opacity="0.4" />
                        <polygon 
                            style="visibility: var(--board_space_visibility, hidden)" 
                            transform="scale(0.9, 0.9) translate(3, 3)" 
                            points="24,48.5 45.3,36.5 45.3,13.5 24,2 3.5,13.5 3.5,36.5" 
                            fill="none" 
                            stroke="#4f4" 
                            stroke-width="4" 
                            stroke-opacity="0.4">

                            <animate
                                attributeType="XML"
                                attributeName="stroke"
                                values="#e95c2e;#f9c4b3;#e95c2e;#e95c2e"
                                dur="1.2s"
                                repeatCount="indefinite"/>

                        </polygon>
                        <polygon 
                            style="visibility: var(--board_space_selected, hidden)" 
                            transform="scale(0.9, 0.9) translate(3, 3)" 
                            points="24,48.5 45.3,36.5 45.3,13.5 24,2 3.5,13.5 3.5,36.5" 
                            fill="none" 
                            stroke="#3c3" 
                            stroke-width="4" 
                            stroke-opacity="0.7">
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

                <g id="elysium_mons" transform="translate(40, 120)">
                    <text class="board_caption">
                        <tspan dy="15">Elysium</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>

                <g id="hecates_tholus"  transform="translate(20, 100)">
                    <text class="board_caption">Hecates Tholus</text>
                </g>

                <g id="arsia_mons" transform="translate(420, 221)">
                <text class="board_caption">
                    <tspan dy="15">Arsia</tspan>
                    <tspan x="4" dy="12">Mons</tspan>
                </text>
                </g>

                <g id="olympus_mons" transform="translate(410, 110)">
                <text class="board_caption">
                    <tspan x="-5" dy="15">Olympus</tspan>
                    <tspan x="4" dy="12">Mons</tspan>
                </text>
                </g>
                
            </svg>
        </div>

        <venus v-if="venusNextExtension" :spaces="getVenusSpaces()" :venusScaleLevel="venusScaleLevel"></venus>
    </div>
    `
});


