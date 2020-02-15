import Vue from "vue";
import * as constants from '../constants';

class GlobalParamLevel {
    constructor(public value: number, public isActive: boolean) {

    }
}

export const GlobalParameters = Vue.component("globs", {
    props: ["oceans_count", "oxygen_level", "temperature"],
    data: function () {
        return {
            "constants": constants
        }
    },
    "methods": {
        "getValuesForParameter": function (targetParameter: string): Array<GlobalParamLevel> {
            let values: Array<GlobalParamLevel> = [];
            const startValue = targetParameter == "oxygen" ? constants.MIN_OXYGEN_LEVEL : constants.MIN_TEMPERATURE;
            const endValue = targetParameter == "oxygen" ? constants.MAX_OXYGEN_LEVEL : constants.MAX_TEMPERATURE;
            const step =  targetParameter == "oxygen" ? 1 : 2;
            let curValue = targetParameter == "oxygen" ? this.oxygen_level : this.temperature;
            console.log(targetParameter, startValue, endValue, step);
            for (let value: number = endValue; value >= startValue; value -= step) {
                values.push(
                    new GlobalParamLevel(value, value <= curValue)
                )
            }
            return values;
        },
        "getScaleCSS": function (paramLevel: GlobalParamLevel): string {
            return paramLevel.isActive ? "globs_figure--active" : ""
        }
    },
    template: `
    <div class="globs_cont">
        <div class="globs">
            <div class="globs_columns_cont">
                <div class="globs_column globs_column--temperature">
                    <div class="globs_item" v-for="lvl in getValuesForParameter('temperature')">
                        <div class="globs_value">{{ lvl.value }}</div>
                        <div class="globs_figure" :class="getScaleCSS(lvl)"></div>
                    </div>
                </div>
                <div class="globs_column globs_column--oxygen">
                    <div class="globs_item" v-for="lvl in getValuesForParameter('oxygen')">
                        <div class="globs_figure" :class="getScaleCSS(lvl)"></div>
                        <div class="globs_value" :class="'glob_value_oxygen--'+lvl.value">{{ lvl.value }}</div>
                    </div>
                </div>
            </div>
            <div class="globs_oceans">
                <div class="globs_oceans_count">{{ oceans_count }}/{{ constants.MAX_OCEAN_TILES }}</div>
            </div>
        </div>
    </div>
    `
});