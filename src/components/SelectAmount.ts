
import Vue from "vue";

export const SelectAmount = Vue.component("select-amount", {
    props: ["playerinput", "onsave"],
    data: function () {
        return {
            amount: 0
        };
    },
    methods: {
        saveAmount: function () {
            return parseInt(this.$data.amount);
        }
    },
    template: `
        <div>
            <div>{{playerinput.title}} - {{playerinput.message}}</div>
            <input type="number" class="nes-input" value="0" min="0" :max="playerinput.max" v-model="amount" />
            <button class="nes-btn" v-on:click="saveAmount">Save</button> 
        </div>
    `
});

