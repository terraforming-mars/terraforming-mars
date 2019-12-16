import Vue from "vue";
import * as constants from '../constants';

export const GlobalParameters = Vue.component("globs", {
    props: ["oceans_count", "oxygen_level", "temperature"],
    data: function () {
        return {
            "constants": constants
        }
    },
    "methods": {
        "getValuesForParameter": function (targetParameter: string): Array<string> {
            let values: Array<string> = []; 
            if (targetParameter == "oxygen") {
                for (let i = constants.MAX_OXYGEN_LEVEL; i>=constants.MIN_OXYGEN_LEVEL; i--) {
                    values.push(i.toString());
                }
            } else {
                for (let i = constants.MAX_TEMPERATURE; i>=constants.MIN_TEMPERATURE; i-=2) {
                    values.push(i.toString());
                }
            }
            return values;
        },
        "getScaleCSS": function (for_param: string): string {
            let ret = "";
            const val:string = (for_param == "oxygen") ? this.oxygen_level : this.temperature;
            const num_val = parseInt(val);
            const TEMPERATURE_SCALE_HEIGHT = 17;
            const OXYGEN_SCALE_HEIGHT = 23;
            const INITIAL_SCALE_MARGIN = 331;
            if (for_param == "temperature") {
                const diff = Math.abs(constants.MIN_TEMPERATURE - 2 - num_val) / 2;
                const height = diff * TEMPERATURE_SCALE_HEIGHT;
                const margin_top = INITIAL_SCALE_MARGIN + TEMPERATURE_SCALE_HEIGHT - height;
                ret = "margin-top: " + margin_top.toString() + "px; height: " + height + "px;";
            } else {
                const diff = num_val + 1;
                const height = diff * OXYGEN_SCALE_HEIGHT;
                const margin_top = INITIAL_SCALE_MARGIN + OXYGEN_SCALE_HEIGHT - height;
                ret = "margin-top: " + margin_top.toString() + "px; height: " + height + "px;";
            }
            return ret
        }
    },
    template: `
    <div class="globs_cont">
        <div class="globs">
            <div class="globs_columns_cont">
                <div class="globs_column globs_column--temperature">
                    <div class="globs_column_scale globs_column_scale--temperature" :style="getScaleCSS('temperature')"></div>
                    <div class="globs_value" v-for="val in getValuesForParameter('temperature')">{{ val }}</div>
                </div><div class="globs_column globs_column--oxygen">
                    <div class="globs_column_scale globs_column_scale--oxygen" :style="getScaleCSS('oxygen')"></div><div class="globs_value" v-for="val in getValuesForParameter('oxygen')">{{ val }}</div>
                </div>
            </div>
            <div class="globs_oceans">
                <div class="globs_oceans_count">{{ oceans_count }}/{{ constants.MAX_OCEAN_TILES }}</div>
            </div>
        </div>
    </div>
    `
});