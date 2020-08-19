
import Vue from "vue";

export const SelectAmount = Vue.component("select-amount", {
    props: ["playerinput", "onsave", "showsave", "showtitle"],
    data: function () {
        return {
            amount: 0
        };
    },
    methods: {
        saveData: function () {
            this.onsave([[parseInt(this.$data.amount)]]);
        }
    },
    template: `<div>
  <div v-if="showtitle === true">{{playerinput.title}}</div>
  <input type="number" class="nes-input" value="0" min="0" :max="playerinput.max" v-model="amount" />
  <button v-if="showsave === true" class="btn btn-lg btn-primary" v-on:click="saveData">{{playerinput.buttonLabel}}</button> 
</div>`
});

