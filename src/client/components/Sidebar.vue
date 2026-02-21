<template>
<div :class="'sidebar_cont sidebar '+getSideBarClass()">
  <div class="tm" :title="$t('Generation Marker')">
    <div class="gen-text" v-i18n>GEN</div>
    <div class="gen-marker">{{ getGenMarker() }}</div>
  </div>
  <div v-if="gameOptions.expansions.turmoil" :title="$t('Ruling Party')">
    <div :class="'party-name party-name-indicator party-name--'+rulingPartyToCss()"> <span v-i18n>{{ getRulingParty() }}</span></div>
  </div>
  <div class="global_params">
    <global-parameter-value :param="globalParameter.TEMPERATURE" :value="temperature"></global-parameter-value>
    <global-parameter-value :param="globalParameter.OXYGEN" :value="oxygen"></global-parameter-value>
    <global-parameter-value :param="globalParameter.OCEANS" :value="oceans"></global-parameter-value>
    <global-parameter-value v-if="gameOptions.expansions.venus" :param="globalParameter.VENUS" :value="venus"></global-parameter-value>
    <MoonGlobalParameterValue v-if="gameOptions.expansions.moon" :moonData="moonData"></MoonGlobalParameterValue>
  </div>
  <div class="sidebar_item preferences_player" :title="$t('Player Color Cube')">
    <div :class="getPlayerColorCubeClass()+' player_bg_color_' + player_color"></div>
  </div>

  <a href="#board" :title="$t('Jump to board')">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--board"></i>
      </div>
  </a>
  <a href="#actions" :title="$t('Jump to actions')">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--actions"></i>
      </div>
  </a>
  <a href="#cards" :title="$t('Jump to cards')">
      <div class="sidebar_item goto-cards sidebar_item_shortcut-long">
          <i class="sidebar_icon sidebar_icon--cards">
            <div class="deck-size">🂠{{ deckSize }}<br>🗑{{ discardPileSize }}</div>
          </i>
      </div>
  </a>
  <a v-if="coloniesCount > 0" href="#colonies" :title="$t('Jump to colonies')">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--colonies"></i>
      </div>
  </a>

  <language-icon></language-icon>

  <div class="sidebar_item sidebar_item--info" :title="$t('Information panel')">
    <i class="sidebar_icon sidebar_icon--info"
      :class="{'sidebar_item--is-active': ui.gamesetup_detail_open}"
      v-on:click="ui.gamesetup_detail_open = !ui.gamesetup_detail_open"
      :title="$t('game setup details')"></i>
    <div class="info_panel" v-if="ui.gamesetup_detail_open">
      <div class="info_panel-spacing"></div>
      <div class="info-panel-title" v-i18n>Game Setup Details</div>
      <game-setup-detail :gameOptions="gameOptions" :playerNumber="playerNumber" :lastSoloGeneration="lastSoloGeneration"></game-setup-detail>

      <div class="info_panel_actions">
        <button class="btn btn-lg btn-primary" v-on:click="ui.gamesetup_detail_open=false" v-i18n>Ok</button>
      </div>
    </div>
  </div>

  <a href="help" target="_blank">
    <div class="sidebar_item sidebar_item--help">
      <i class="sidebar_icon sidebar_icon--help" :title="$t('player aid')"></i>
    </div>
  </a>

  <preferences-icon></preferences-icon>
</div>
</template>

<script lang="ts">

import {defineComponent} from '@/client/vue3-compat';
import {Color} from '@/common/Color';
import {getPreferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {TurmoilModel} from '@/common/models/TurmoilModel';
import {PartyName} from '@/common/turmoil/PartyName';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {GameOptionsModel} from '@/common/models/GameOptionsModel';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';
import MoonGlobalParameterValue from '@/client/components/moon/MoonGlobalParameterValue.vue';
import {GlobalParameter} from '@/common/GlobalParameter';
import {MoonModel} from '@/common/models/MoonModel';
import PreferencesIcon from '@/client/components/PreferencesIcon.vue';
import LanguageIcon from '@/client/components/LanguageIcon.vue';

export default defineComponent({
  name: 'sidebar',
  props: {
    playerNumber: {
      type: Number,
      required: true,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
      required: true,
    },
    acting_player: {
      type: Boolean,
      required: true,
    },
    player_color: {
      type: String as () => Color,
      required: true,
    },
    generation: {
      type: Number,
      required: true,
    },
    coloniesCount: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    oxygen: {
      type: Number,
      required: true,
    },
    oceans: {
      type: Number,
      required: true,
    },
    venus: {
      type: Number,
      required: true,
    },
    moonData: {
      type: Object as () => MoonModel | undefined,
      default: undefined,
    },
    turmoil: {
      type: Object as () => TurmoilModel | undefined,
      default: undefined,
    },
    lastSoloGeneration: {
      type: Number,
      required: true,
    },
    deckSize: {
      type: Number,
      required: true,
    },
    discardPileSize: {
      type: Number,
      required: true,
    },
  },
  components: {
    'game-setup-detail': GameSetupDetail,
    'global-parameter-value': GlobalParameterValue,
    MoonGlobalParameterValue,
    PreferencesIcon,
    LanguageIcon,
  },
  data() {
    return {
      'ui': {
        'gamesetup_detail_open': false,
      },
      'globalParameter': GlobalParameter,
    };
  },
  methods: {
    getPlayerColorCubeClass(): string {
      return this.acting_player && (getPreferences().hide_animated_sidebar === false) ? 'preferences_player_inner active' : 'preferences_player_inner';
    },
    getSideBarClass(): string {
      return this.acting_player && (getPreferences().hide_animated_sidebar === false) ? 'preferences_acting_player' : 'preferences_nonacting_player';
    },
    getGenMarker(): string {
      return `${this.generation}`;
    },
    rulingPartyToCss(): string {
      if (this.turmoil?.ruling === undefined) {
        console.warn('no party provided');
        return '';
      }
      return this.turmoil.ruling.toLowerCase().split(' ').join('_');
    },
    getRulingParty(): string {
      const ruling = this.turmoil?.ruling;
      switch (ruling) {
      case PartyName.MARS:
        return 'Mars';
      case PartyName.SCIENTISTS:
        return 'Science';
      case PartyName.KELVINISTS:
        return 'Kelvin';
      case undefined:
        return '???';
      default:
        return ruling;
      }
    },
  },
  computed: {
    preferencesManager(): PreferencesManager {
      return PreferencesManager.INSTANCE;
    },
  },
});

</script>
