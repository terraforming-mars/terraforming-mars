<template>
    <div class="help-iconology-container">
        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Card Tags</div>
            </div>
            <div>
                <div class="resource-tag tag-building"></div>
                <div class="help-icon-label" v-i18n>Building</div>
            </div>
            <div>
                <div class="resource-tag tag-space"></div>
                <div class="help-icon-label" v-i18n>Space</div>
            </div>
            <div>
                <div class="resource-tag tag-science"></div>
                <div class="help-icon-label" v-i18n>Science</div>
            </div>
            <div>
                <div class="resource-tag tag-power"></div>
                <div class="help-icon-label" v-i18n>Power</div>
            </div>
            <div>
                <div class="resource-tag tag-earth"></div>
                <div class="help-icon-label" v-i18n>Earth</div>
            </div>
            <div>
                <div class="resource-tag tag-jovian"></div>
                <div class="help-icon-label" v-i18n>Jovian</div>
                </div>
            <div>
                <div class="resource-tag tag-venus"></div>
                <div class="help-icon-label" v-i18n>Venus</div>
                <div class="expansion-icon expansion-icon-venus"></div>
            </div>
            <div>
                <div class="resource-tag tag-plant"></div>
                <div class="help-icon-label" v-i18n>Plant</div>
            </div>
            <div>
                <div class="resource-tag tag-microbe"></div>
                <div class="help-icon-label" v-i18n>Microbe</div>
            </div>
            <div>
                <div class="resource-tag tag-animal"></div>
                <div class="help-icon-label" v-i18n>Animal</div>
            </div>
            <div>
                <div class="resource-tag tag-city"></div>
                <div class="help-icon-label" v-i18n>City</div>
            </div>
            <br>
            <div>
                <div class="resource-tag tag-wild"></div>
                <div class="help-icon-label" v-i18n>Wild</div>
                <div class="expansion-icon expansion-icon-prelude"></div>
                <div class="expansion-icon expansion-icon-colony"></div>
                <div class="expansion-icon expansion-icon-turmoil"></div>

            </div>
            <div>
                <div class="resource-tag tag-event"></div>
                <div class="help-icon-label" v-i18n>Event</div>
            </div>
            <br>
            <div class="help-icon-sublabel" v-i18n>
                Fan Expansion Tags
            </div>
            <div>
                <div class="resource-tag tag-moon"></div>
                <div class="help-icon-label" v-i18n>Moon</div>
                <div class="expansion-icon expansion-icon-themoon"></div>
            </div>
            <div>
                <div class="resource-tag tag-mars"></div>
                <div class="help-icon-label" v-i18n>Mars</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="resource-tag tag-clone"></div>
                <div class="help-icon-label" v-i18n>Clone</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>

        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Resources</div>
            </div>
            <div class="help-icon-sublabel" v-i18n>
                Standard Resources
            </div>
            <div>
                <div class="help-icon-resource money"><div class="help-icon-mc-font">€</div></div>
                <div class="help-icon-label" v-i18n>MegaCredits (M€)</div>
            </div>
            <div>
                <div class="help-icon-resource steel"></div>
                <div class="help-icon-label" v-i18n>Steel</div>
            </div>
            <div>
                <div class="help-icon-resource titanium"></div>
                <div class="help-icon-label" v-i18n>Titanium</div>
            </div>
            <div>
                <div class="help-icon-resource plant"></div>
                <div class="help-icon-label" v-i18n>Plant</div>
            </div>
            <div>
                <div class="help-icon-resource energy"></div>
                <div class="help-icon-label" v-i18n>Energy</div>
            </div>
            <div>
                <div class="help-icon-resource heat"></div>
                <div class="help-icon-label" v-i18n>Heat</div>
            </div>
            <div class="help-icon-sublabel" v-i18n>
                Resources on Cards
            </div>
            <div>
                <div class="help-icon-resource animal"></div>
                <div class="help-icon-label" v-i18n>Animal</div>
            </div>
            <div>
                <div class="help-icon-resource microbe"></div>
                <div class="help-icon-label" v-i18n>Microbe</div>
            </div>
            <div>
                <div class="help-icon-resource science"></div>
                <div class="help-icon-label" v-i18n>Science</div>
            </div>
            <div>
                <div class="help-icon-resource floater"></div>
                <div class="help-icon-label" v-i18n>Floater</div>
            </div>
            <div>
                <div class="help-icon-resource asteroid"></div>
                <div class="help-icon-label" v-i18n>Asteroid</div>
                <div class="expansion-icon expansion-icon-venus"></div>
                <div class="expansion-icon expansion-icon-promo"></div>
            </div>
            <div>
                <div class="help-icon-resource preservation"></div>
                <div class="help-icon-label" v-i18n>Preservation</div>
                <div class="expansion-icon expansion-icon-turmoil"></div>
            </div>
            <div>
                <div class="help-icon-resource camp"></div>
                <div class="help-icon-label" v-i18n>Camp</div>
                <div class="expansion-icon expansion-icon-colony"></div>
            </div>
            <div>
                <div class="help-icon-resource disease"></div>
                <div class="help-icon-label" v-i18n>Disease</div>
                <div class="expansion-icon expansion-icon-promo"></div>
            </div>
            <!-- <br>
            <div class="help-icon-sublabel" v-i18n>
                Fan Expansion Card Resources
            </div>
            <div>
                <div class="help-icon-resource resource-cube"></div>
                <div class="help-icon-label" v-i18n>Resource cube</div>
                <div class="expansion-icon expansion-icon-themoon"></div>
            </div>
            <div>
                <div class="help-icon-resource data"></div>
                <div class="help-icon-label" v-i18n>Data</div>
                <div class="expansion-icon expansion-icon-themoon"></div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="help-icon-resource syndicate-fleet"></div>
                <div class="help-icon-label" v-i18n>Syndicate Fleet</div>
                <div class="expansion-icon expansion-icon-themoon"></div>
            </div>
            <div>
                <div class="help-icon-resource venusian-habitat"></div>
                <div class="help-icon-label" v-i18n>Venusian Habitat</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="help-icon-resource specialized-robot"></div>
                <div class="help-icon-label" v-i18n>Specialized Robot</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="help-icon-resource seed"></div>
                <div class="help-icon-label" v-i18n>Seed</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="help-icon-resource agenda"></div>
                <div class="help-icon-label" v-i18n>Agenda</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div>
            <div>
                <div class="help-icon-resource orbital"></div>
                <div class="help-icon-label" v-i18n>Orbital</div>
                <div class="expansion-icon expansion-icon-pathfinders"></div>
            </div> -->
        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Tiles</div>
            </div>
            <div>
                <div class="tile greenery-no-O2-tile"></div>
                <div class="help-icon-label" v-i18n>Greenery</div>
            </div>
            <div>
                <div class="tile city-tile"></div>
                <div class="help-icon-label" v-i18n>City</div>
            </div>
            <div>
                <div class="tile ocean-tile"></div>
                <div class="help-icon-label" v-i18n>Ocean</div>
            </div>
            <div>
                <div class="tile special-tile"></div>
                <div class="help-icon-label" v-i18n>Special</div>
            </div>
        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Global Parameters</div>
            </div>
            <div>
                <div class="tile help-icon-param-box-temperature"></div>
                <div class="help-icon-label" v-i18n>Temperature</div>
            </div>
            <div>
                <div class="tile help-icon-param-box-oxygen"></div>
                <div class="help-icon-label" v-i18n>Oxygen</div>
            </div>
            <div>
                <div class="tile help-icon-param-box-ocean"></div>
                <div class="help-icon-label" v-i18n>Oceans</div>
            </div>
            <div>
                <div class="tile help-icon-param-box-venus"></div>
                <div class="help-icon-label" v-i18n>Venus</div>
            </div>
        </div>
        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Others</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="help-icon-victory-point">?</div></div>
                <div class="help-icon-label" v-i18n>Victory Point (VP)</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="tile rating"></div></div>
                <div class="help-icon-label" v-i18n>Terraform Rating (TR)</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="help-icon-card card"></div></div>
                <div class="help-icon-label" v-i18n>Project Card</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="tile colony"></div></div>
                <div class="help-icon-label" v-i18n>Colony</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="tile trade"></div></div>
                <div class="help-icon-label" v-i18n>Trade</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="tile fleet"></div></div>
                <div class="help-icon-label" v-i18n>Trade Fleet</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="help-icon-delegate"></div></div>
                <div class="help-icon-label" v-i18n>Delegate</div>
            </div>
            <div>
                <div class="help-other-symbols"><div class="help-icon-influence influence"></div></div>
                <div class="help-icon-label" v-i18n>Influence</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'HelpIconology',
});
</script>
