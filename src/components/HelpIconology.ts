import Vue from 'vue';
import {Card} from './card/Card';

export const HelpIconology = Vue.component('help-iconology', {
  components: {
    Card,
  },
  methods: {

  },
  template: `
    <div class="help-page-container">
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title" v-i18n>Card Tags</div>
            </div>
            <div>
                <div class="resource-tag tag-building"></div>
                <div class="help-page-label" v-i18n>Building</div>
            </div>
            <div>
                <div class="resource-tag tag-space"></div>
                <div class="help-page-label" v-i18n>Space</div>
            </div>
            <div>
                <div class="resource-tag tag-science"></div>
                <div class="help-page-label" v-i18n>Science</div>
            </div>
            <div>
                <div class="resource-tag tag-power"></div>
                <div class="help-page-label" v-i18n>Power</div>
            </div>
            <div>
                <div class="resource-tag tag-earth"></div>
                <div class="help-page-label" v-i18n>Earth</div>
            </div>
            <div>
                <div class="resource-tag tag-jovian"></div>
                <div class="help-page-label" v-i18n>Jovian</div>
                </div>
            <div>
                <div class="resource-tag tag-venus"></div>
                <div class="help-page-label" v-i18n>Venus</div>
                <div class="expansion-icon expansion-icon-venus"></div>
            </div>
            <div>
                <div class="resource-tag tag-plant"></div>
                <div class="help-page-label" v-i18n>Plant</div>
            </div>
            <div>
                <div class="resource-tag tag-microbe"></div>
                <div class="help-page-label" v-i18n>Microbe</div>
            </div>
            <div>
                <div class="resource-tag tag-animal"></div>
                <div class="help-page-label" v-i18n>Animal</div>
            </div>
            <div>
                <div class="resource-tag tag-city"></div>
                <div class="help-page-label" v-i18n>City</div>
            </div>
            <br>
            <div>
                <div class="resource-tag tag-wild"></div>
                <div class="help-page-label" v-i18n>Wild</div>
            </div>
            <div>
                <div class="resource-tag tag-event"></div>
                <div class="help-page-label" v-i18n>Event</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title" v-i18n>Resources</div>
            </div>
            <div class="help-page-sublabel" v-i18n>
                Standard Resources
            </div>
            <div>
                <div class="help-page-resource money"><div class="help-page-mc-font">€</div></div>
                <div class="help-page-label" v-i18n>MegaCredits (M€)</div>
            </div>
            <div>
                <div class="help-page-resource steel"></div>
                <div class="help-page-label" v-i18n>Steel</div>
            </div>
            <div>
                <div class="help-page-resource titanium"></div>
                <div class="help-page-label" v-i18n>Titanium</div>
            </div>
            <div>
                <div class="help-page-resource plant"></div>
                <div class="help-page-label" v-i18n>Plant</div>
            </div>
            <div>
                <div class="help-page-resource energy"></div>
                <div class="help-page-label" v-i18n>Energy</div>
            </div>
            <div>
                <div class="help-page-resource heat"></div>
                <div class="help-page-label" v-i18n>Heat</div>
            </div>
            <div class="help-page-sublabel" v-i18n>
                Resources on Cards
            </div>
            <div>
                <div class="help-page-resource animal"></div>
                <div class="help-page-label" v-i18n>Animal</div>
            </div>
            <div>
                <div class="help-page-resource microbe"></div>
                <div class="help-page-label" v-i18n>Microbe</div>
            </div>
            <div>
                <div class="help-page-resource science"></div>
                <div class="help-page-label" v-i18n>Science</div>
            </div>
            <div>
                <div class="help-page-resource floater"></div>
                <div class="help-page-label" v-i18n>Floater</div>
            </div>
            <div>
                <div class="help-page-resource asteroid"></div>
                <div class="help-page-label" v-i18n>Asteroid</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title" v-i18n>Tiles</div>
            </div>
            <div>
                <div class="tile greenery-no-O2-tile"></div>
                <div class="help-page-label" v-i18n>Greenery</div>
            </div>
            <div>
                <div class="tile city-tile"></div>
                <div class="help-page-label" v-i18n>City</div>
            </div>
            <div>
                <div class="tile ocean-tile"></div>
                <div class="help-page-label" v-i18n>Ocean</div>
            </div>
            <div>
                <div class="tile special-tile"></div>
                <div class="help-page-label" v-i18n>Special</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title" v-i18n>Global Parameters</div>
            </div>
            <div>
                <div class="tile help-page-param-box-temperature"></div>
                <div class="help-page-label" v-i18n>Temperature</div>
            </div>
            <div>
                <div class="tile help-page-param-box-oxygen"></div>
                <div class="help-page-label" v-i18n>Oxygen</div>
            </div>
            <div>
                <div class="tile help-page-param-box-ocean"></div>
                <div class="help-page-label" v-i18n>Oceans</div>
            </div>
            <div>
                <div class="tile help-page-param-box-venus"></div>
                <div class="help-page-label" v-i18n>Venus</div>
            </div>
        </div>
        
        <div class="help-page-column">
            <div>
                <div class="help-page-section-title" v-i18n>Others</div>
            </div>
            <div>
                <div class="help-page-victory-point">?</div>
                <div class="help-page-label" v-i18n>Victory Point (VP)</div>
            </div>
            <div>
                <div class="tile rating"></div>
                <div class="help-page-label" v-i18n>Terraform Rating (TR)</div>
            </div>
            <div>
                <div class="help-page-card card"></div>
                <div class="help-page-label" v-i18n>Project Card</div>
            </div>
            <div>
                <div class="tile colony"></div>
                <div class="help-page-label" v-i18n>Colony</div>
            </div>
            <div>
                <div class="tile trade"></div>
                <div class="help-page-label" v-i18n>Trade</div>
            </div>
            <div>
                <div class="tile fleet"></div>
                <div class="help-page-label" v-i18n>Trade Fleet</div>
            </div>
            <div>
                <div class="help-page-delegate"></div>
                <div class="help-page-label" v-i18n>Delegate</div>
            </div>
            <div>
                <div class="help-page-influence influence"></div>
                <div class="help-page-label" v-i18n>Influence</div>
            </div>
        </div>
    </div>
    `,
});
