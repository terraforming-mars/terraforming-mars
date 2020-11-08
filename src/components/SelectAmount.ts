import Vue from "vue";
import { Button } from "../components/common/Button";
import { PlayerInputModel } from "../models/PlayerInputModel";

export const SelectAmount = Vue.component("select-amount", {
    components: {
        "Button": Button
    },
    props: {
        playerinput: {
            type: Object as () => PlayerInputModel
        },
        onsave: {
            type: Object as () => (out: Array<Array<string>>) => void
        },
        showsave: {
            type: Boolean
        },
        showtitle: {
            type: Boolean
        }
    },
    data: function () {
        return {
            amount: "0",
        };
    },
    methods: {
        saveData: function () {
            this.onsave([[String(parseInt(this.amount))]]);
        },
        setMaxValue: function () {
            this.amount = String(this.playerinput.max);
        },
    },
    template: `
    <div>
        <div v-if="showtitle === true">{{playerinput.title}}</div>
        <div class="flex">
            <input type="number" class="nes-input" value="0" min="0" :max="playerinput.max" v-model="amount" />
            <Button size="big" type="max" :onClick="setMaxValue" title="MAX" />
            <Button v-if="showsave === true" size="big" :onClick="saveData" :title="playerinput.buttonLabel" />
        </div>
    </div>`,
});
