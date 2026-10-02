<template>
  <div class="help-solo-rules-container" v-html="rendered"></div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {renderMarkdown} from '@/client/markdown/markdown';

// Each paragraph, list item, and heading is one translation key, icon shortcodes included.
const SOLO_RULES = `
### Your goal

Score as many victory points as you can, but make sure you meet the victory condition in time, or you lose.

### Game modes

Choose one of two game modes when creating the game. Each has a different victory condition.

- Standard Mode (:tag:mars:): you win if every global parameter is maxed before time runs out.
  - :expansion:venus: This includes Venus if Venus Next is included.
  - :expansion:themoon: This includes Moon tracks if The Moon is included with Moon track completion required.
- 63 TR Mode (:icon:tr:): you win if your TR is 63 or higher when time runs out.

### How it works

All the multiplayer rules apply, plus those of any chosen expansions, except as modified here.

- You play a fixed number of generations: 14 for the base game. You always play every generation, even if you meet the victory condition early.
- Victory is checked immediately after the final production phase.
- If you lost, the game is over and you have no score.
- If you won, continue to the final greenery conversion and score normally.
  - 63 TR Mode (:icon:tr:): placing greenery during the final greenery conversion can still raise oxygen and your TR. That TR counts toward your score, but not toward winning.

### Other changes

- You begin with 14 TR instead of 20.
- There are no milestones or awards.
- There is a neutral opponent. It does not take turns, but:
  - It counts as a player or opponent for any card that uses those terms (e.g. Philares, Mons Insurance, attack cards, Crash Site Cleanup).
  - It has unlimited production and resources of every kind. Your cards can always decrease or remove them, and this counts as having actually happened (e.g. for Mons Insurance, Ants, Predators, and cards that steal).
  - It starts with 2 cities, each with an adjacent greenery, placed randomly on the board. These greeneries do not raise oxygen. Tharsis Republic still triggers for both cities.
- 63 TR Mode only (:icon:tr:): an extra standard project, Buffer Gas, is available. Spend 16 M€ to increase your TR 1 step.

### Changes by expansion

- :expansion:venus: Venus Next: Standard Mode (:tag:mars:) also requires Venus to be maxed to win.
- :expansion:prelude: Prelude: play 12 generations instead of 14.
- :expansion:colony: Colonies: decrease your M€ production 2 steps at the start of the game. One extra colony tile is dealt, and you choose one colony tile to remove from the game.
- :expansion:turmoil: Turmoil: the Reds ruling bonus gives you 1 TR if your TR is 20 or less. Some global events have special solo text.
  - :expansion:agendas: Agendas: The alternative ruling bonus takes 1 TR from you if your TR is higher than 20.
- :expansion:themoon: The Moon:
  - Standard Mode (:tag:mars:), with the option to require Moon track completion, also requires the Moon tracks to be maxed to win, and you play 2 more generations.
  - 63 TR Mode (:icon:tr:): no changes.
- :expansion:ares: Ares Extreme: Standard Mode (:tag:mars:) also requires you to remove all unprotected hazards to win. With World Government Terraforming, you may remove an unprotected hazard instead of raising a global parameter.

Adapted from [Terraforming Mars: solo rules summary](https://github.com/MartianZoo/player-resources/blob/main/solo-rules-summary.md)
`;

export default defineComponent({
  name: 'HelpSoloRules',
  computed: {
    rendered(): string {
      return renderMarkdown(SOLO_RULES);
    },
  },
});
</script>
