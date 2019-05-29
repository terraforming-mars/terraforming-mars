
import Vue from "vue";

export const SelectAmount = Vue.component("select-amount", {
    props: ["playerinput", "onsave", "showtitle"],
    data: function () {
        return {
            amount: 0
        };
    },
    methods: {
        saveAmount: function () {
            this.onsave([[parseInt(this.$data.amount)]]);
        }
    },
    template: `
        <div>
            <div v-if="showtitle === true">{{playerinput.title}}</div>
            <input type="number" class="nes-input" value="0" min="0" :max="playerinput.max" v-model="amount" />
            <button class="nes-btn" v-on:click="saveAmount">Save</button> 
        </div>
    `
});

