<template>
<div :class="'sidebar_cont sidebar '+getSideBarClass()">
  <div class="tm">
    <div class="gen-text">GEN</div>
    <div class="gen-marker">{{ getGenMarker() }}</div>
  </div>
  <div v-if="gameOptions.turmoilExtension">
    <div :class="'party-name party-name-indicator party-name--'+rulingPartyToCss()"> {{ getRulingParty() }}</div>
  </div>
  <div class="global_params">
    <global-parameter-value :param="this.globalParameter.TEMPERATURE" :value="this.temperature"></global-parameter-value>
    <global-parameter-value :param="this.globalParameter.OXYGEN" :value="this.oxygen"></global-parameter-value>
    <global-parameter-value :param="this.globalParameter.OCEANS" :value="this.oceans"></global-parameter-value>
    <global-parameter-value v-if="gameOptions.venusNextExtension" :param="this.globalParameter.VENUS" :value="this.venus"></global-parameter-value>
    <MoonGlobalParameterValue v-if="gameOptions.moonExpansion" :moonData="this.moonData"></MoonGlobalParameterValue>
  </div>
  <div class="sidebar_item preferences_player">
    <div :class="getPlayerColorCubeClass()+' player_bg_color_' + player_color"></div>
  </div>

  <a href="#board">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--board"></i>
      </div>
  </a>
  <a href="#actions">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--actions"></i>
      </div>
  </a>
  <a href="#cards">
      <div class="sidebar_item goto-cards sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--cards"><slot></slot></i>
      </div>
  </a>
  <a v-if="coloniesCount > 0" href="#colonies">
      <div class="sidebar_item sidebar_item_shortcut">
          <i class="sidebar_icon sidebar_icon--colonies"></i>
      </div>
  </a>

  <div class="sidebar_item sidebar_item--info">
    <i class="sidebar_icon sidebar_icon--info"
      :class="{'sidebar_item--is-active': ui.gamesetup_detail_open}"
      v-on:click="ui.gamesetup_detail_open = !ui.gamesetup_detail_open"
      :title="$t('game setup details')"></i>
    <div class="info_panel" v-if="ui.gamesetup_detail_open">
      <div class="info_panel-spacing"></div>
      <div class="info-panel-title" v-i18n>Game Setup Details</div>
      <game-setup-detail :gameOptions="gameOptions" :playerNumber="playerNumber" :lastSoloGeneration="lastSoloGeneration"></game-setup-detail>

      <div class="info_panel_actions">
        <button class="btn btn-lg btn-primary" v-on:click="ui.gamesetup_detail_open=false">Ok</button>
      </div>
    </div>
  </div>

  <a href="/help" target="_blank">
    <div class="sidebar_item sidebar_item--help">
      <i class="sidebar_icon sidebar_icon--help" :title="$t('player aid')"></i>
    </div>
  </a>

  <div class="sidebar_item sidebar_item--settings">
    <i class="sidebar_icon sidebar_icon--settings" :class="{'sidebar_item--is-active': ui.preferences_panel_open}" v-on:click="ui.preferences_panel_open = !ui.preferences_panel_open"></i>
    <preferences-dialog v-show="ui.preferences_panel_open" @okButtonClicked="ui.preferences_panel_open = false"/>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import {Color} from '@/Color';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {LANGUAGES} from '@/constants';
import {TurmoilModel} from '@/models/TurmoilModel';
import {PartyName} from '@/turmoil/parties/PartyName';
import GameSetupDetail from '@/client/components/GameSetupDetail.vue';
import {GameOptionsModel} from '@/models/GameOptionsModel';
import GlobalParameterValue from '@/client/components/GlobalParameterValue.vue';
import MoonGlobalParameterValue from '@/client/components/MoonGlobalParameterValue.vue';
import {GlobalParameter} from '@/GlobalParameter';
import {MoonModel} from '@/models/MoonModel';
import PreferencesDialog from '@/client/components/PreferencesDialog.vue';

export default Vue.extend({
  name: 'sidebar',
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
    acting_player: {
      type: Boolean,
    },
    player_color: {
      type: String as () => Color,
    },
    generation: {
      type: Number,
    },
    coloniesCount: {
      type: Number,
    },
    temperature: {
      type: Number,
    },
    oxygen: {
      type: Number,
    },
    oceans: {
      type: Number,
    },
    venus: {
      type: Number,
    },
    moonData: {
      type: Object as () => MoonModel,
    },
    turmoil: {
      type: Object as () => TurmoilModel || undefined,
    },
    lastSoloGeneration: {
      type: Number,
    },
  },
  components: {
    'game-setup-detail': GameSetupDetail,
    'global-parameter-value': GlobalParameterValue,
    MoonGlobalParameterValue,
    'preferences-dialog': PreferencesDialog,
  },
  data() {
    return {
      'ui': {
        'preferences_panel_open': false,
        'gamesetup_detail_open': false,
      },
      'hide_hand': false,
      'hide_awards_and_milestones': false,
      'hide_top_bar': false,
      'small_cards': false,
      'remove_background': false,
      'magnify_cards': true,
      'show_alerts': true,
      'lang': 'en',
      'langs': LANGUAGES,
      'enable_sounds': false,
      'hide_tile_confirmation': false,
      'show_card_number': false,
      'hide_discount_on_cards': false,
      'learner_mode': true,
      'hide_animated_sidebar': false,
      'globalParameter': GlobalParameter,
    };
  },
  methods: {
    getPlayerColorCubeClass(): string {
      return this.acting_player && (PreferencesManager.loadBoolean('hide_animated_sidebar') === false) ? 'preferences_player_inner active' : 'preferences_player_inner';
    },
    getSideBarClass(): string {
      return this.acting_player && (PreferencesManager.loadBoolean('hide_animated_sidebar') === false) ? 'preferences_acting_player' : 'preferences_nonacting_player';
    },
    getGenMarker(): string {
      return `${this.generation}`;
    },
    rulingPartyToCss(): string {
      if (this.turmoil.ruling === undefined) {
        console.warn('no party provided');
        return '';
      }
      return this.turmoil.ruling.toLowerCase().split(' ').join('_');
    },
    getRulingParty(): string {
      const rulingPartyName = this.turmoil.ruling;
      if (rulingPartyName === PartyName.MARS) {
        return 'Mars';
      } else if (rulingPartyName === PartyName.SCIENTISTS) {
        return 'Science';
      } else if (rulingPartyName === PartyName.KELVINISTS) {
        return 'Kelvin';
      } else {
        return rulingPartyName as string;
      }
    },
  },
});

</script>
