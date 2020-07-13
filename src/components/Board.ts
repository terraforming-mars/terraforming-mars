
import Vue from "vue";
import * as constants from '../constants';
import { BoardSpace } from "./BoardSpace";
import { SpaceModel } from "../models/SpaceModel";
import { SpaceType } from "../SpaceType";
import { PreferencesManager } from "./PreferencesManager";

class GlobalParamLevel {
    constructor(public value: number, public isActive: boolean, public strValue: string) {

    }
}

class AlertDialog {
    static shouldAlert = true;
}

export const Board = Vue.component("board", {
    props: ["spaces", "venusNextExtension", "venusScaleLevel","boardName", "oceans_count", "oxygen_level", "temperature", "shouldNotify"],
    components: {
        "board-space": BoardSpace
    },
    data: function () {
        return {
            "constants": constants
        }
    },
    mounted: function () {
        if (this.marsIsTerraformed() && this.shouldNotify && AlertDialog.shouldAlert && PreferencesManager.loadValue("show_alerts") === "1") {
            alert("Mars is Terraformed!");
            AlertDialog.shouldAlert = false;
        };
    },
    methods: {
        getAllSpacesOnMars: function (): Array<SpaceModel> {
            const boardSpaces: Array<SpaceModel> = this.spaces;
            boardSpaces.sort(
                (space1: SpaceModel, space2: SpaceModel) => {return parseInt(space1.id) - parseInt(space2.id)}
            );
            return boardSpaces.filter((s: SpaceModel) => {return s.spaceType != SpaceType.COLONY})
        },
        getSpaceById: function (spaceId: string) {
            for (let space of this.spaces) {
                if (space.id === spaceId) {
                    return space
                }
            }
            throw "Board space not found by id '" + spaceId + "'"
        },
        getValuesForParameter: function (targetParameter: string): Array<GlobalParamLevel> {
            let values: Array<GlobalParamLevel> = [];
            var startValue: number;
            var endValue: number;
            var step: number;
            var curValue: number;
            var strValue: string;

            switch (targetParameter) {
                case "oxygen":
                    startValue = constants.MIN_OXYGEN_LEVEL;
                    endValue = constants.MAX_OXYGEN_LEVEL;
                    step = 1;
                    curValue = this.oxygen_level;
                    break;
                case "temperature":
                    startValue = constants.MIN_TEMPERATURE;
                    endValue = constants.MAX_TEMPERATURE;
                    step = 2;
                    curValue = this.temperature;
                    break;
                case "venus":
                    startValue = constants.MIN_VENUS_SCALE;
                    endValue = constants.MAX_VENUS_SCALE;
                    step = 2;
                    curValue = this.venusScaleLevel;
                    break;
                default:
                    throw "Wrong parameter to get values from";
            }

            for (let value: number = endValue; value >= startValue; value -= step) {
                strValue = (targetParameter == "temperature" && value > 0) ? "+"+value : value.toString();
                values.push(
                    new GlobalParamLevel(value, value <= curValue, strValue)
                )
            }
            return values;
        },
        getScaleCSS: function (paramLevel: GlobalParamLevel): string {
            let css = "global-numbers-value val-" + paramLevel.value + " ";
            if (paramLevel.isActive) {
                css += "val-is-active";
            }
            return css
        },
        marsIsTerraformed: function () {
            const temperatureMaxed = this.temperature === constants.MAX_TEMPERATURE;
            const oceansMaxed = this.oceans_count === constants.MAX_OCEAN_TILES;
            const oxygenMaxed = this.oxygen_level === constants.MAX_OXYGEN_LEVEL;
            const venusMaxed = this.venusScaleLevel === constants.MAX_VENUS_SCALE;

            if (this.venusNextExtension) {
                return temperatureMaxed && oceansMaxed && oxygenMaxed && venusMaxed;
            } else {
                return temperatureMaxed && oceansMaxed && oxygenMaxed;
            }
        }
    },
    template: `
    <div class="board-cont">
        <div class="board-outer-spaces">
            <board-space :space="getSpaceById('01')" text="Ganymede Colony"></board-space>
            <board-space :space="getSpaceById('02')" text="Phobos Space Haven"></board-space>
            <board-space :space="getSpaceById('69')" text="Stanford Torus"></board-space>
            <board-space :space="getSpaceById('70')" text="Luna Metropolis" v-if="venusNextExtension"></board-space>
            <board-space :space="getSpaceById('71')" text="Dawn City" v-if="venusNextExtension"></board-space>
            <board-space :space="getSpaceById('72')" text="Stratopolis" v-if="venusNextExtension"></board-space>
            <board-space :space="getSpaceById('73')" text="Maxwell Base" v-if="venusNextExtension"></board-space>
        </div>

        <div class="global-numbers">
            <div class="global-numbers-temperature">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('temperature')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oxygen">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('oxygen')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-venus" v-if="venusNextExtension">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('venus')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oceans">
                <div class="global-numbers-value">{{ oceans_count }}/{{ constants.MAX_OCEAN_TILES }}</div>
            </div>
        </div>

        <div class="board" id="main_board">
            <board-space :space="curSpace" :is_selectable="true" :key="'board-space-'+curSpace.id" v-for="curSpace in getAllSpacesOnMars()"></board-space>
            <svg id="board_legend" height="550" width="630" class="board-legend">
                <g v-if="boardName === 'original'" id="ascraeus_mons" transform="translate(95, 192)">
                    <text class="board-caption">
                        <tspan dy="15">Ascraeus</tspan>
                        <tspan x="12" dy="12">Mons</tspan>
                    </text>
                </g>
                
                <g v-if="boardName === 'original'" id="pavonis_mons" transform="translate(90, 230)">
                    <text class="board-caption">
                        <tspan dy="15">Pavonis</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>
                
                <g v-if="boardName === 'original'" id="arsia_mons" transform="translate(77, 275)">
                    <text class="board-caption">
                        <tspan dy="15">Arsia</tspan>
                        <tspan x="-2" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'original'" id="tharsis_tholus" transform="translate(85, 175)">
                    <text class="board-caption" dx="47">
                        <tspan dy="-7">Tharsis</tspan>
                        <tspan dy="12" x="48">Tholus</tspan>
                    </text>
                    <line y1="-3" x2="160" y2="2" class="board-line" x1="90"></line>
                    <text x="158" y="5" class="board-caption board_caption--black">&#x25cf;</text>
                </g>
                
                <g v-if="boardName === 'original'" id="noctis_city" transform="translate(85, 320)">
                    <text class="board-caption">
                        <tspan dy="15">Noctis</tspan>
                        <tspan x="7" dy="12">City</tspan>
                    </text>
                    <line x1="30" y1="20" x2="140" y2="-20" class="board-line"></line>
                    <text x="136" y="-18" class="board-caption board_caption--black">&#x25cf;</text>
                </g>

                <g v-if="boardName === 'elysium'" id="elysium_mons" transform="translate(110, 190)">
                    <text class="board-caption">
                        <tspan dy="15">Elysium</tspan>
                        <tspan x="8" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="hecatus_tholus"  transform="translate(130, 150)">
                    <text class="board-caption">
                        <tspan dy="15">Hecatus</tspan>
                        <tspan x="3" dy="12">Tholus</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="arsia_mons" transform="translate(545, 272)">
                    <text class="board-caption">
                        <tspan dy="15">Arsia</tspan>
                        <tspan x="0" dy="12">Mons</tspan>
                    </text>
                </g>

                <g v-if="boardName === 'elysium'" id="olympus_mons" transform="translate(505, 190)">
                    <text class="board-caption">
                        <tspan x="-5" dy="15">Olympus</tspan>
                        <tspan x="4" dy="12">Mons</tspan>
                    </text>
                </g>
            </svg>
        </div>
    </div>
    `
});
