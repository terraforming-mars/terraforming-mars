<template>
  <div class="help-solo-rules-container">
    <div class="help-icons-section-heading" v-i18n>Your goal</div>
    <p v-i18n>Score as many victory points as you can, but make sure you meet the victory condition in time, or you lose.</p>

    <div class="help-icons-section-heading" v-i18n>Game modes</div>
    <p v-i18n>Choose one of two game modes when creating the game. Each has a different victory condition.</p>
    <ul>
      <li><span v-i18n>Standard Mode</span> (<span class="help-solo-mode-icon help-solo-mode-standard"></span>): <span v-i18n>you win if every global parameter is maxed before time runs out.</span>
        <ul>
          <li><div class="expansion-icon expansion-icon-venus"></div><span v-i18n>This includes Venus if Venus Next is included.</span></li>
          <li><div class="expansion-icon expansion-icon-themoon"></div><span v-i18n>This includes Moon tracks if The Moon is included with Moon track completion required.</span></li>
        </ul>
      </li>
      <li><span v-i18n>63 TR Mode</span> (<span class="help-solo-mode-icon help-solo-mode-tr"></span>): <span v-i18n>you win if your TR is 63 or higher when time runs out.</span></li>
    </ul>

    <div class="help-icons-section-heading" v-i18n>How it works</div>
    <p v-i18n>All the multiplayer rules apply, plus those of any chosen expansions, except as modified here.</p>
    <ul>
      <li v-i18n>You play a fixed number of generations: 14 for the base game. You always play every generation, even if you meet the victory condition early.</li>
      <li v-i18n>Victory is checked immediately after the final production phase.</li>
      <li v-i18n>If you lost, the game is over and you have no score.</li>
      <li><span v-i18n>If you won, continue to the final greenery conversion and score normally.</span>
        <ul>
          <li><span v-i18n>63 TR Mode</span> (<span class="help-solo-mode-icon help-solo-mode-tr"></span>): <span v-i18n>placing greenery during the final greenery conversion can still raise oxygen and your TR. That TR counts toward your score, but not toward winning.</span></li>
        </ul>
      </li>
    </ul>

    <div class="help-icons-section-heading" v-i18n>Other changes</div>
    <ul>
      <li v-i18n>You begin with 14 TR instead of 20.</li>
      <li v-i18n>There are no milestones or awards.</li>
      <li>
        <span v-i18n>There is a neutral opponent. It does not take turns, but:</span>
        <ul>
          <li v-i18n>It counts as a player or opponent for any card that uses those terms (e.g. Philares, Mons Insurance, attack cards, Crash Site Cleanup).</li>
          <li v-i18n>It has unlimited production and resources of every kind. Your cards can always decrease or remove them, and this counts as having actually happened (e.g. for Mons Insurance, Ants, Predators, and cards that steal).</li>
          <li v-i18n>It starts with 2 cities, each with an adjacent greenery, placed randomly on the board. These greeneries do not raise oxygen. Tharsis Republic still triggers for both cities.</li>
        </ul>
      </li>
      <li><span v-i18n>63 TR Mode only</span> (<span class="help-solo-mode-icon help-solo-mode-tr"></span>): <span v-i18n>an extra standard project, Buffer Gas, is available. Spend 16 M€ to increase your TR 1 step.</span></li>
    </ul>

    <div class="help-icons-section-heading" v-i18n>Changes by expansion</div>
    <ul>
      <li>
        <div class="expansion-icon expansion-icon-venus"></div>
        <span v-i18n>Venus Next:</span> <span v-i18n>Standard Mode</span> (<span class="help-solo-mode-icon help-solo-mode-standard"></span>) <span v-i18n>also requires Venus to be maxed to win.</span>
      </li>
      <li>
        <div class="expansion-icon expansion-icon-prelude"></div>
        <span v-i18n>Prelude: play 12 generations instead of 14.</span>
      </li>
      <li>
        <div class="expansion-icon expansion-icon-colony"></div>
        <span v-i18n>Colonies: decrease your M€ production 2 steps at the start of the game. One extra colony tile is dealt, and you choose one colony tile to remove from the game.</span>
      </li>
      <li>
        <div class="expansion-icon expansion-icon-turmoil"></div>
        <span v-i18n>Turmoil: the Reds ruling bonus gives you 1 TR if your TR is 20 or less. Some global events have special solo text.</span>
        <ul>
          <li><div class="expansion-icon expansion-icon-agendas"></div><span v-i18n>Agendas: The alternative ruling bonus takes 1 TR from you if your TR is higher than 20.</span></li>
        </ul>
      </li>
      <li>
        <div class="expansion-icon expansion-icon-themoon"></div>
        <span v-i18n>The Moon:</span>
        <ul>
          <li><span v-i18n>Standard Mode</span> (<span class="help-solo-mode-icon help-solo-mode-standard"></span>), <span v-i18n>with the option to require Moon track completion, also requires the Moon tracks to be maxed to win, and you play 2 more generations.</span></li>
          <li><span v-i18n>63 TR Mode</span> (<span class="help-solo-mode-icon help-solo-mode-tr"></span>): <span v-i18n>no changes.</span></li>
        </ul>
      </li>
      <li>
        <div class="expansion-icon expansion-icon-ares"></div>
        <span v-i18n>Ares Extreme:</span> <span v-i18n>Standard Mode</span> (<span class="help-solo-mode-icon help-solo-mode-standard"></span>) <span v-i18n>also requires you to remove all unprotected hazards to win.</span> <span v-i18n>With World Government Terraforming, you may remove an unprotected hazard instead of raising a global parameter.</span>
      </li>
    </ul>

    <p>
      <span v-i18n>Adapted from</span>&nbsp;
      <a href="https://github.com/MartianZoo/player-resources/blob/main/solo-rules-summary.md" target="_blank" v-i18n>Terraforming Mars: solo rules summary</a>
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HelpSoloRules',
});
</script>
