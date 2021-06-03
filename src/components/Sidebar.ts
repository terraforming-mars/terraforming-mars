import Vue from 'vue';
import {Color} from '../Color';
import {PreferencesManager} from './PreferencesManager';
import {LANGUAGES} from '../constants';
import {TurmoilModel} from '../models/TurmoilModel';
import {PartyName} from '../turmoil/parties/PartyName';
import {GameSetupDetail} from './GameSetupDetail';
import {GameOptionsModel} from '../models/GameOptionsModel';
import {TranslateMixin} from './TranslateMixin';
import {GlobalParameterValue} from './GlobalParameterValue';
import {MoonGlobalParameterValue} from './MoonGlobalParameterValue';
import {GlobalParameter} from '../GlobalParameter';
import {MoonModel} from '../models/MoonModel';
import {PreferencesDialog} from './PreferencesDialog';

export const Sidebar = Vue.component('sidebar', {
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
    'moon-global-parameter-value': MoonGlobalParameterValue,
    'preferences-dialog': PreferencesDialog,
  },
  mixins: [TranslateMixin],
  data: function() {
    return {
      'ui': {
        'preferences_panel_open': false,
        'gamesetup_detail_open': false,
      },
      'hide_hand': false as boolean | unknown[],
      'hide_awards_and_milestones': false as boolean | unknown[],
      'hide_top_bar': false as boolean | unknown[],
      'small_cards': false as boolean | unknown[],
      'remove_background': false as boolean | unknown[],
      'magnify_cards': true as boolean | unknown[],
      'show_alerts': true as boolean | unknown[],
      'lang': 'en',
      'langs': LANGUAGES,
      'enable_sounds': false as boolean | unknown[],
      'hide_tile_confirmation': false as boolean | unknown[],
      'show_card_number': false as boolean | unknown[],
      'hide_discount_on_cards': false as boolean | unknown[],
      'learner_mode': true as boolean | unknown[],
      'hide_animated_sidebar': false as boolean | unknown[],
      'globalParameter': GlobalParameter,
    };
  },
  methods: {
    getPlayerColorCubeClass: function(): string {
      return this.acting_player && (PreferencesManager.loadBoolean('hide_animated_sidebar') === false) ? 'preferences_player_inner active' : 'preferences_player_inner';
    },
    getSideBarClass: function(): string {
      return this.acting_player && (PreferencesManager.loadBoolean('hide_animated_sidebar') === false) ? 'preferences_acting_player' : 'preferences_nonacting_player';
    },
    getGenMarker: function(): string {
      return `${this.generation}`;
    },
    rulingPartyToCss: function(): string {
      if (this.turmoil.ruling === undefined) {
        console.warn('no party provided');
        return '';
      }
      return this.turmoil.ruling.toLowerCase().split(' ').join('_');
    },
    getRulingParty: function(): string {
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
  template: `
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
    <moon-global-parameter-value v-if="gameOptions.moonExpansion" :moonData="this.moonData"></moon-global-parameter-value>
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
    `,
});
