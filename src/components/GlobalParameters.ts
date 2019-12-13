import Vue from "vue";

export const GlobalParameters = Vue.component("globs", {
    props: ["oceans_count", "oxygen_level", "temperature"],
    data: function () {
        return {}
    },
    "methods": {
        "getValuesRange": function (for_param: string): Array<string> {
            let values: Array<string> = []; 
            if (for_param == "oxygen") {
                for (let i = 14; i>=0; i--) {
                    values.push(i.toString())
                }
            } else {
                for (let i = 8; i>=-30; i-=2) {
                    values.push(i.toString())
                }
            }
            return values;
        },
        "getScaleCSS": function (for_param: string): string {
            let ret = "";
            const val:string = (for_param == "oxygen") ? this.oxygen_level : this.temperature;
            const num_val = parseInt(val);
            if (for_param == "temperature") {
                const diff = Math.abs(-32 - num_val) / 2;
                const height = diff * 17;
                const margin_top = 322 + 17 - height;
                ret = "margin-top: " + margin_top.toString() + "px; height: " + height + "px;";
                console.log(ret);
            } else {
                const diff = num_val+1;
                const height = diff * 24;
                const margin_top = 322 + 24 - height;
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
                    <div class="globs_value" v-for="val in getValuesRange('temperature')">{{ val }}</div>
                </div><div class="globs_column globs_column--oxygen">
                    <div class="globs_column_scale globs_column_scale--oxygen" :style="getScaleCSS('oxygen')"></div><div class="globs_value" v-for="val in getValuesRange('oxygen')">{{ val }}</div>
                </div>
            </div>
            <div class="globs_oceans">
                <div class="globs_oceans_count">{{ oceans_count }}/9</div>
            </div>
        </div>
    </div>
    `
});