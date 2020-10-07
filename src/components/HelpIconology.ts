import Vue from "vue";
import { Card } from "./Card";

export const HelpIconology = Vue.component("help-iconology", {
    components: {
        Card
    },
    methods: {
        
    },
    template: `
        <div class="help-iconology-container">
            <div class="row" style="display: flex;">
                <div class="column" style="flex: 25%; padding: 10px;">
                    <section class="help-iconology-tags">
                    <h2>Card Tags</h2>
                        <div class="resource-tag tag-building" /> : Building tag<br>
                        <div class="resource-tag tag-space" /> : Space tag<br>
                        <div class="resource-tag tag-science" /> : Science tag<br>
                        <div class="resource-tag tag-power" /> : Power tag<br>
                        <div class="resource-tag tag-earth" /> : Earth tag<br>
                        <div class="resource-tag tag-jovian" /> : Jovian tag<br>
                        <div class="resource-tag tag-venus" /> : Venus tag<br>
                        <div class="resource-tag tag-plant" /> : Plant tag<br>
                        <div class="resource-tag tag-microbe" /> : Microbe tag<br>
                        <div class="resource-tag tag-animal" /> : Animal tag<br>
                        <div class="resource-tag tag-city" /> : City tag<br>
                        <div class="resource-tag tag-wild" /> : Wild tag<br>
                        <div class="resource-tag tag-event" /> : Event tag<br>
                    </section>
                </div>
                <div class="column" style="flex: 25%; padding: 10px;">                        
                    <section class="help-iconology-resources">
                    <h2>Resources</h2>
                        <div class="resource money" /> : Mega credits<br>
                        <div class="resource steel" /> : Steel<br>
                        <div class="resource titanium" /> : Titanium<br>
                        <div class="resource plant" /> : Plant<br>
                        <div class="resource energy" /> : Energy<br>
                        <div class="resource heat" /> : Heat<br>
                        <br>
                        <div class="resource animal" /> : Animal<br>
                        <div class="resource microbe" /> : Microbe<br>
                        <div class="resource science" /> : Science<br>
                        <div class="resource fighter" /> : Fighter<br>
                        <div class="resource floater" /> : Floater<br>
                        <br>
                        <div class="tile rating" /> : Terraforming Rating (TR)<br>
                        <div class="tile colony" /> : Colony<br>
                        <div class="tile fleet" /> : Trade Fleet<br>
                    </section>
                </div>
                <div class="column" style="flex: 25%; padding: 10px;">                        
                    <section class="help-iconology-tiles">
                    <h2>Tiles</h2>
                        <div class="tile greenery-no-O2-tile" /> : Greenery<br>
                        <div class="tile city-tile" /> : City<br>
                        <div class="tile ocean-tile" /> : Ocean<br>
                        <div class="tile special-tile" /> : Special<br>
                    </section>
                </div>
                <div class="column" style="flex: 25%; padding: 10px;">                        
                    <section class="help-iconology-parameters">
                    <h2>Global Parameters</h2>
                        <div class="tile temperature-tile" /> : Temperature<br>
                        <div class="tile oxygen-tile" /> : Oxygen<br>
                        <div class="tile ocean-tile" /> : Ocean<br>
                        <div class="tile venus-tile" /> : Venus<br>
                    </section>
                </div>
            </div>

        </div>
    `
})