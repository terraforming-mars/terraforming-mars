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
                <div class="column">
                    <section class="help-iconology-tags">
                    <h2>Card Tags</h2>
                        <div class="resource-tag tag-building"></div> : Building<br>
                        <div class="resource-tag tag-space"></div> : Space<br>
                        <div class="resource-tag tag-science"></div> : Science<br>
                        <div class="resource-tag tag-power"></div> : Power<br>
                        <div class="resource-tag tag-earth"></div> : Earth<br>
                        <div class="resource-tag tag-jovian"></div> : Jovian<br>
                        <div class="resource-tag tag-venus"></div> : Venus<br>
                        <div class="resource-tag tag-plant"></div> : Plant<br>
                        <div class="resource-tag tag-microbe"></div> : Microbe<br>
                        <div class="resource-tag tag-animal"></div> : Animal<br>
                        <div class="resource-tag tag-city"></div> : City<br>
                        <div class="resource-tag tag-wild"></div> : Wild<br>
                        <div class="resource-tag tag-event"></div> : Event<br>
                    </section>
                </div>
                <div class="column">                        
                    <section class="help-iconology-resources">
                    <h2>Resources</h2>
                        <div class="resource money"></div> : Megacredits<br>
                        <div class="resource steel"></div> : Steel<br>
                        <div class="resource titanium"></div> : Titanium<br>
                        <div class="resource plant"></div> : Plant<br>
                        <div class="resource energy"></div> : Energy<br>
                        <div class="resource heat"></div> : Heat<br>
                        <br>
                        <div class="resource animal"></div> : Animal<br>
                        <div class="resource microbe"></div> : Microbe<br>
                        <div class="resource science"></div> : Science<br>
                        <div class="resource fighter"></div> : Fighter<br>
                        <div class="resource floater"></div> : Floater<br>
                        <br>
                        <div class="tile rating"></div> : Terraforming Rating (TR)<br>
                        <div class="tile colony"></div> : Colony<br>
                        <div class="tile fleet"></div> : Trade Fleet<br>
                    </section>
                </div>
                <div class="column">                        
                    <section class="help-iconology-tiles">
                    <h2>Tiles</h2>
                        <div class="tile greenery-no-O2-tile"></div> : Greenery<br>
                        <div class="tile city-tile"></div> : City<br>
                        <div class="tile ocean-tile"></div> : Ocean<br>
                        <div class="tile special-tile"></div> : Special<br>
                    </section>
                </div>
                <div class="column">                        
                    <section class="help-iconology-parameters">
                    <h2>Global Parameters</h2>
                        <div class="help-iconology-param-box"><div class="tile temperature-tile"></div></div> : Temperature<br>
                        <div class="help-iconology-param-box"><div class="tile oxygen-tile"></div></div> : Oxygen<br>
                        <div class="help-iconology-param-box"><div class="tile ocean-tile"></div></div> : Ocean<br>
                        <div class="help-iconology-param-box"><div class="tile venus-tile"></div></div> : Venus<br>
                    </section>
                </div>
            </div>

        </div>
    `
})