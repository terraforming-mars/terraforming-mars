<template>
  <div class="help-rulebooks-container">
    <div class="help-rulebooks-section">
      <div class="help-icons-section-heading" v-i18n>Official Expansions</div>
      <div class="help-rulebook-rows">
        <a v-for="entry in officialExpansions" :key="entry.module" :href="entry.url" class="help-rulebook-row" target="_blank" v-i18n>
          <div class="create-game-expansion-icon" :class="expansionIconClass(entry.module)"></div>
          {{ entry.name }}
        </a>
      </div>
    </div>
    <div class="help-rulebooks-section">
      <div class="help-icons-section-heading" v-i18n>Fan Expansions</div>
      <div class="help-rulebook-rows">
        <a v-for="entry in fanExpansions" :key="entry.module" :href="entry.url" class="help-rulebook-row" target="_blank" v-i18n>
          <div class="create-game-expansion-icon" :class="expansionIconClass(entry.module)"></div>
          {{ entry.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {RULEBOOK_URLS} from '@/client/utils/WikiLinks';
import {GameModule} from '@/common/cards/GameModule';
import {expansionIconClass} from '@/client/utils/expansionIcon';

interface RulebookEntry {
  module: GameModule;
  name: string;
  url: string;
}

const officialExpansions: ReadonlyArray<RulebookEntry> = [
  {module: 'corpera', name: 'Corporate Era', url: RULEBOOK_URLS.corpera},
  {module: 'venus', name: 'Venus Next', url: RULEBOOK_URLS.venus},
  {module: 'prelude', name: 'Prelude', url: RULEBOOK_URLS.prelude},
  {module: 'prelude2', name: 'Prelude 2', url: RULEBOOK_URLS.prelude2},
  {module: 'colonies', name: 'Colonies', url: RULEBOOK_URLS.colonies},
  {module: 'turmoil', name: 'Turmoil', url: RULEBOOK_URLS.turmoil},
];

const fanExpansions: ReadonlyArray<RulebookEntry> = [
  {module: 'promo', name: 'Promos', url: RULEBOOK_URLS.promo},
  {module: 'ares', name: 'Ares', url: RULEBOOK_URLS.ares},
  {module: 'community', name: 'Community', url: RULEBOOK_URLS.community},
  {module: 'moon', name: 'The Moon', url: RULEBOOK_URLS.moon},
  {module: 'pathfinders', name: 'Pathfinders', url: RULEBOOK_URLS.pathfinders},
  {module: 'ceo', name: 'CEOs', url: RULEBOOK_URLS.ceo},
  {module: 'starwars', name: 'Star Wars', url: RULEBOOK_URLS.starwars},
  {module: 'underworld', name: 'Underworld', url: RULEBOOK_URLS.underworld},
  {module: 'deltaProject', name: 'Delta Project', url: RULEBOOK_URLS.deltaProject},
];

export default defineComponent({
  name: 'HelpRulebooks',
  data() {
    return {
      officialExpansions,
      fanExpansions,
    };
  },
  methods: {
    expansionIconClass,
  },
});
</script>
