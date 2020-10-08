import Vue from "vue";
import { Card } from "./Card";

export const HelpIconology = Vue.component("help-iconology", {
    components: {
        Card
    },
    methods: {
        
    },
    template: `
    <div class="help-page-container">
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title">Card Tags</div>
            </div>
            <div>
                <div class="resource-tag tag-building"></div>
                <div class="help-page-label">Building</div>
            </div>
            <div>
                <div class="resource-tag tag-space"></div>
                <div class="help-page-label">Space</div>
            </div>
            <div>
                <div class="resource-tag tag-science"></div>
                <div class="help-page-label">Science</div>
            </div>
            <div>
                <div class="resource-tag tag-power"></div>
                <div class="help-page-label">Power</div>
            </div>
            <div>
                <div class="resource-tag tag-earth"></div>
                <div class="help-page-label">Earth</div>
            </div>
            <div>
                <div class="resource-tag tag-jovian"></div>
                <div class="help-page-label">Jovian</div>
                </div>
            <div>
                <div class="resource-tag tag-venus"></div>
                <div class="help-page-label">Venus</div>
                <div class="expansion-icon expansion-icon-venus"></div>
            </div>
            <div>
                <div class="resource-tag tag-plant"></div>
                <div class="help-page-label">Plant</div>
            </div>
            <div>
                <div class="resource-tag tag-microbe"></div>
                <div class="help-page-label">Microbe</div>
            </div>
            <div>
                <div class="resource-tag tag-animal"></div>
                <div class="help-page-label">Animal</div>
            </div>
            <div>
                <div class="resource-tag tag-city"></div>
                <div class="help-page-label">City</div>
            </div>
            <br>
            <div>
                <div class="resource-tag tag-wild"></div>
                <div class="help-page-label">Wild</div>
            </div>
            <div>
                <div class="resource-tag tag-event"></div>
                <div class="help-page-label">Event</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title">Resources</div>
            </div>
            <div class="help-page-sublabel">
                Standard Resources
            </div>
            <div>
                <div class="help-page-resource money"><div class="help-page-mc-font">€</div></div>
                <div class="help-page-label">MegaCredits (M€)</div>
            </div>
            <div>
                <div class="help-page-resource steel"></div>
                <div class="help-page-label">Steel</div>
            </div>
            <div>
                <div class="help-page-resource titanium"></div>
                <div class="help-page-label">Titanium</div>
            </div>
            <div>
                <div class="help-page-resource plant"></div>
                <div class="help-page-label">Plant</div>
            </div>
            <div>
                <div class="help-page-resource energy"></div>
                <div class="help-page-label">Energy</div>
            </div>
            <div>
                <div class="help-page-resource heat"></div>
                <div class="help-page-label">Heat</div>
            </div>
            <div class="help-page-sublabel">
                Resources on Cards
            </div>
            <div>
                <div class="help-page-resource animal"></div>
                <div class="help-page-label">Animal</div>
            </div>
            <div>
                <div class="help-page-resource microbe"></div>
                <div class="help-page-label">Microbe</div>
            </div>
            <div>
                <div class="help-page-resource science"></div>
                <div class="help-page-label">Science</div>
            </div>
            <div>
                <div class="help-page-resource floater"></div>
                <div class="help-page-label">Floater</div>
            </div>
            <div>
                <div class="help-page-resource asteroid"></div>
                <div class="help-page-label">Asteroid</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title">Tiles</div>
            </div>
            <div>
                <div class="tile greenery-no-O2-tile"></div>
                <div class="help-page-label">Greenery</div>
            </div>
            <div>
                <div class="tile city-tile"></div>
                <div class="help-page-label">City</div>
            </div>
            <div>
                <div class="tile ocean-tile"></div>
                <div class="help-page-label">Ocean</div>
            </div>
            <div>
                <div class="tile special-tile"></div>
                <div class="help-page-label">Special</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title">Global Parameters</div>
            </div>
            <div>
                <div class="tile help-page-param-box-temperature"></div>
                <div class="help-page-label">Temperature</div>
            </div>
            <div>
                <div class="tile help-page-param-box-oxygen"></div>
                <div class="help-page-label">Oxygen</div>
            </div>
            <div>
                <div class="tile help-page-param-box-ocean"></div>
                <div class="help-page-label">Oceans</div>
            </div>
            <div>
                <div class="tile help-page-param-box-venus"></div>
                <div class="help-page-label">Venus</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title">Others</div>
            </div>
            <div>
                <div class="help-page-victory-point">?</div>
                <div class="help-page-label">Victory Point (VP)</div>
            </div>
            <div>
                <div class="tile rating"></div>
                <div class="help-page-label">Terraform Rating (TR)</div>
            </div>
            <div>
                <div class="resource card"></div>
                <div class="help-page-label">Project Card</div>
            </div>
            <div>
                <div class="tile colony"></div>
                <div class="help-page-label">Colony</div>
            </div>
            <div>
                <div class="tile trade"></div>
                <div class="help-page-label">Trade</div>
            </div>
            <div>
                <div class="tile fleet"></div>
                <div class="help-page-label">Trade Fleet</div>
            </div>
            <div>
                <div class="tile player-token neutral"></div>
                <div class="help-page-label">Delegate</div>
            </div>
            <div>
                <div class="tile influence"></div>
                <div class="help-page-label">Influence</div>
            </div>
        </div>
    </div>
    `
})