<template>
    <div class="help-iconology-container">
        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Card Tags</div>
            </div>
            <div v-for="entry in officialCardTags" :key="entry.label">
                <div :class="`resource-tag ${entry.iconClass}`"></div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
                <div v-for="expansion in entry.expansions" :key="expansion" class="expansion-icon" :class="expansionIconClass(expansion)"></div>
            </div>
            <template v-if="fanCardTags.length > 0">
                <br>
                <div>
                    <div class="help-icon-sublabel" v-i18n>Fan Expansion Tags</div>
                </div>
                <div v-for="entry in fanCardTags" :key="entry.label">
                    <div :class="`resource-tag ${entry.iconClass}`"></div>
                    <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
                    <div v-for="expansion in entry.expansions" :key="expansion" class="expansion-icon" :class="expansionIconClass(expansion)"></div>
                </div>
            </template>
        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Resources</div>
            </div>
            <div>
                <div class="help-icon-sublabel" v-i18n>Standard Resources</div>
            </div>
            <div v-for="entry in standardResources" :key="entry.label">
                <div class="help-icon-resource" :class="entry.iconClass">
                    <div v-if="entry.innerText" class="help-icon-mc-font">{{ entry.innerText }}</div>
                </div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
            </div>
            <br>
            <div>
                <div class="help-icon-sublabel" v-i18n>Resources on Cards</div>
            </div>
            <div v-for="entry in officialCardResources" :key="entry.label">
                <div class="help-icon-resource" :class="entry.iconClass"></div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
                <div v-for="expansion in entry.expansions" :key="expansion" class="expansion-icon" :class="expansionIconClass(expansion)"></div>
            </div>
            <template v-if="fanCardResources.length > 0">
                <br>
                <div>
                    <div class="help-icon-sublabel" v-i18n>
                        Fan Expansion Card Resources
                    </div>
                </div>
                <div v-for="entry in fanCardResources" :key="entry.label">
                    <div class="help-icon-resource" :class="entry.iconClass"></div>
                    <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
                    <div v-for="expansion in entry.expansions" :key="expansion" class="expansion-icon" :class="expansionIconClass(expansion)"></div>
                </div>
            </template>
        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Tiles</div>
            </div>
            <div v-for="entry in tiles" :key="entry.label">
                <div class="tile" :class="entry.iconClass"></div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
            </div>
        </div>

        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Global Parameters</div>
            </div>
            <div v-for="entry in globalParameters" :key="entry.label">
                <div class="tile" :class="entry.iconClass"></div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
            </div>
        </div>
        <div class="help-icons-column">
            <div>
                <div class="help-icons-section-heading" v-i18n>Others</div>
            </div>
            <div v-for="entry in others" :key="entry.label">
                <div class="help-other-symbols"><div :class="entry.iconClass">{{ entry.innerText }}</div></div>
                <div class="help-icon-label" v-i18n>{{ entry.label }}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import {GameModule} from '@/common/cards/GameModule';

// A single icon-legend entry: the CSS class that draws the icon, its label, and (for anything
// that came from a specific expansion) the small expansion badge(s) shown next to it. This lets
// new tags/resources/tiles be added as a data entry instead of a hand-typed markup block --
// and the `official` split below is what makes this cleanly separable for an upstream PR.
type IconEntry = {
  iconClass: string;
  label: string;
  official: boolean;
  expansions?: ReadonlyArray<GameModule>;
  innerText?: string;
};

// Mirrors the same expansion -> badge-class exceptions used by CardList.vue's
// expansionIconClass() -- most modules match their own name, a few don't.
const EXPANSION_ICON_CLASS: Partial<Record<GameModule, string>> = {
  base: 'expansion-icon-base',
  corpera: 'expansion-icon-CE',
  colonies: 'expansion-icon-colony',
  moon: 'expansion-icon-themoon',
};

const CARD_TAGS: ReadonlyArray<IconEntry> = [
  {iconClass: 'tag-building', label: 'Building', official: true},
  {iconClass: 'tag-space', label: 'Space', official: true},
  {iconClass: 'tag-science', label: 'Science', official: true},
  {iconClass: 'tag-power', label: 'Power', official: true},
  {iconClass: 'tag-earth', label: 'Earth', official: true},
  {iconClass: 'tag-jovian', label: 'Jovian', official: true},
  {iconClass: 'tag-venus', label: 'Venus', official: true, expansions: ['venus']},
  {iconClass: 'tag-plant', label: 'Plant', official: true},
  {iconClass: 'tag-microbe', label: 'Microbe', official: true},
  {iconClass: 'tag-animal', label: 'Animal', official: true},
  {iconClass: 'tag-city', label: 'City', official: true},
  {iconClass: 'tag-wild', label: 'Wild', official: true, expansions: ['prelude', 'colonies', 'turmoil']},
  {iconClass: 'tag-event', label: 'Event', official: true},
  {iconClass: 'tag-moon', label: 'Moon', official: false, expansions: ['moon']},
  {iconClass: 'tag-mars', label: 'Mars', official: false, expansions: ['pathfinders']},
  {iconClass: 'tag-clone', label: 'Clone', official: false, expansions: ['pathfinders']},
  {iconClass: 'tag-crime', label: 'Crime', official: false, expansions: ['underworld']},
];

const STANDARD_RESOURCES: ReadonlyArray<IconEntry> = [
  {iconClass: 'money', label: 'MegaCredits (M€)', official: true, innerText: '€'},
  {iconClass: 'steel', label: 'Steel', official: true},
  {iconClass: 'titanium', label: 'Titanium', official: true},
  {iconClass: 'plant', label: 'Plant', official: true},
  {iconClass: 'energy', label: 'Energy', official: true},
  {iconClass: 'heat', label: 'Heat', official: true},
];

const CARD_RESOURCES: ReadonlyArray<IconEntry> = [
  {iconClass: 'animal', label: 'Animal', official: true},
  {iconClass: 'microbe', label: 'Microbe', official: true},
  {iconClass: 'science', label: 'Science', official: true},
  {iconClass: 'floater', label: 'Floater', official: true},
  {iconClass: 'asteroid', label: 'Asteroid', official: true, expansions: ['venus', 'promo']},
  {iconClass: 'preservation', label: 'Preservation', official: true, expansions: ['turmoil']},
  {iconClass: 'camp', label: 'Camp', official: true, expansions: ['colonies']},
  {iconClass: 'disease', label: 'Disease', official: true, expansions: ['promo']},
  {iconClass: 'fighter', label: 'Fighter', official: true},
  {iconClass: 'card-resource-cube', label: 'Resource cube', official: false, expansions: ['moon']},
  {iconClass: 'card-resource-data', label: 'Data', official: false, expansions: ['moon', 'pathfinders']},
  {iconClass: 'card-resource-syndicate-fleet', label: 'Syndicate Fleet', official: false, expansions: ['moon']},
  {iconClass: 'card-resource-venusian-habitat', label: 'Venusian Habitat', official: false, expansions: ['pathfinders']},
  {iconClass: 'card-resource-specialized-robot', label: 'Specialized Robot', official: false, expansions: ['pathfinders']},
  {iconClass: 'card-resource-seed', label: 'Seed', official: false, expansions: ['pathfinders']},
  {iconClass: 'card-resource-agenda', label: 'Agenda', official: false, expansions: ['pathfinders']},
  {iconClass: 'card-resource-orbital', label: 'Orbital', official: false, expansions: ['pathfinders']},
  {iconClass: 'card-resource-clone-trooper', label: 'Clone Trooper', official: false, expansions: ['starwars']},
  {iconClass: 'card-resource-tool', label: 'Tool', official: false, expansions: ['underworld']},
  {iconClass: 'card-resource-ware', label: 'Ware', official: false, expansions: ['underworld']},
  {iconClass: 'card-resource-journalism', label: 'Journalism', official: false, expansions: ['underworld']},
  {iconClass: 'card-resource-activist', label: 'Activist', official: false, expansions: ['underworld']},
  {iconClass: 'card-resource-supply-chain', label: 'Supply Chain', official: false, expansions: ['underworld']},
];

const TILES: ReadonlyArray<IconEntry> = [
  {iconClass: 'greenery-no-O2-tile', label: 'Greenery', official: true},
  {iconClass: 'city-tile', label: 'City', official: true},
  {iconClass: 'ocean-tile', label: 'Ocean', official: true},
  {iconClass: 'special-tile', label: 'Special', official: true},
];

const GLOBAL_PARAMETERS: ReadonlyArray<IconEntry> = [
  {iconClass: 'help-icon-param-box-temperature', label: 'Temperature', official: true},
  {iconClass: 'help-icon-param-box-oxygen', label: 'Oxygen', official: true},
  {iconClass: 'help-icon-param-box-ocean', label: 'Oceans', official: true},
  {iconClass: 'help-icon-param-box-venus', label: 'Venus', official: true},
];

const OTHERS: ReadonlyArray<IconEntry> = [
  {iconClass: 'help-icon-victory-point', label: 'Victory Point (VP)', official: true, innerText: '?'},
  {iconClass: 'tile rating', label: 'Terraform Rating (TR)', official: true},
  {iconClass: 'help-icon-card card', label: 'Project Card', official: true},
  {iconClass: 'tile colony', label: 'Colony', official: true},
  {iconClass: 'tile trade', label: 'Trade', official: true},
  {iconClass: 'tile fleet', label: 'Trade Fleet', official: true},
  {iconClass: 'help-icon-delegate', label: 'Delegate', official: true},
  {iconClass: 'help-icon-influence influence', label: 'Influence', official: true},
];

export default defineComponent({
  name: 'HelpIconology',
  data() {
    return {
      standardResources: STANDARD_RESOURCES,
      tiles: TILES,
      globalParameters: GLOBAL_PARAMETERS,
      others: OTHERS,
    };
  },
  computed: {
    officialCardTags(): ReadonlyArray<IconEntry> {
      return CARD_TAGS.filter((entry) => entry.official);
    },
    fanCardTags(): ReadonlyArray<IconEntry> {
      return CARD_TAGS.filter((entry) => !entry.official);
    },
    officialCardResources(): ReadonlyArray<IconEntry> {
      return CARD_RESOURCES.filter((entry) => entry.official);
    },
    fanCardResources(): ReadonlyArray<IconEntry> {
      return CARD_RESOURCES.filter((entry) => !entry.official);
    },
  },
  methods: {
    expansionIconClass(expansion: GameModule): string {
      return EXPANSION_ICON_CLASS[expansion] ?? `expansion-icon-${expansion}`;
    },
  },
});
</script>
