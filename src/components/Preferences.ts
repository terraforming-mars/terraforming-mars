import Vue from 'vue';
import {Color} from '../Color';
import {PreferencesManager} from './PreferencesManager';
import {LANGUAGES} from '../constants';
import {MAX_OCEAN_TILES, MAX_TEMPERATURE, MAX_OXYGEN_LEVEL, MAX_VENUS_SCALE} from '../constants';
import {TurmoilModel} from '../models/TurmoilModel';
import {PartyName} from '../turmoil/parties/PartyName';
import {GameSetupDetail} from '../components/GameSetupDetail';
import {GameOptionsModel} from '../models/GameOptionsModel';
import {TranslateMixin} from './TranslateMixin';

export const Preferences = Vue.component('preferences', {
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
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
    turmoil: {
      type: Object as () => TurmoilModel || undefined,
    },
    lastSoloGeneration: {
      type: Number,
    },
  },
  components: {
    'game-setup-detail': GameSetupDetail,
  },
  mixins: [TranslateMixin],
  data: function() {
    return {
      'ui': {
        'preferences_panel_open': false,
        'gamesetup_detail_open': false,
      },
      'hide_corporation': false as boolean | unknown[],
      'hide_hand': false as boolean | unknown[],
      'hide_cards': false as boolean | unknown[],
      'hide_awards_and_milestones': false as boolean | unknown[],
      'hide_tag_overview': false as boolean | unknown[],
      'hide_turnorder': false as boolean | unknown[],
      'hide_corporation_names': false as boolean | unknown[],
      'hide_top_bar': false as boolean | unknown[],
      'small_cards': false as boolean | unknown[],
      'remove_background': false as boolean | unknown[],
      'magnify_cards': true as boolean | unknown[],
      'magnify_card_descriptions': true as boolean | unknown[],
      'show_alerts': true as boolean | unknown[],
      'hide_ma_scores': false as boolean | unknown[],
      'hide_non_blue_cards': false as boolean | unknown[],
      'hide_log': false as boolean | unknown[],
      'lang': 'en',
      'langs': LANGUAGES,
      'enable_sounds': false as boolean | unknown[],
      'smooth_scrolling': false as boolean | unknown[],
      'hide_tile_confirmation': false as boolean | unknown[],
      'show_card_number': false as boolean | unknown[],
      'show_discount_on_cards': true as boolean | unknown[],
      'learner_mode': true as boolean | unknown[],
    };
  },
  methods: {
    setPreferencesCSS: function(
      val: boolean | undefined,
      cssClassSuffix: string,
    ): void {
      const target = document.getElementById('ts-preferences-target');
      if (!target) return;
      if (val) {
        target.classList.add('preferences_' + cssClassSuffix);
      } else {
        target.classList.remove('preferences_' + cssClassSuffix);
      }

      if (!target.classList.contains('language-' + this.lang)) {
        target.classList.add('language-' + this.lang);
      }
    },
    updatePreferencesFromStorage: function(): Map<
            string,
            boolean | string
            > {
      for (const k of PreferencesManager.keys) {
        const val = PreferencesManager.loadValue(k);
        if (k === 'lang') {
          PreferencesManager.preferencesValues.set(k, this.$data[k]);
          this[k] = val || 'en';
          PreferencesManager.preferencesValues.set(k, val || 'en');
        } else {
          const boolVal = val !== '' ? val === '1' : this.$data[k];
          PreferencesManager.preferencesValues.set(k, val === '1');
          this.$data[k] = boolVal;
        }
      }
      return PreferencesManager.preferencesValues;
    },
    updatePreferences: function(_evt: any): void {
      let strVal: string = '';
      for (const k of PreferencesManager.keys) {
        const val = PreferencesManager.preferencesValues.get(k);
        if (val !== this.$data[k]) {
          if (k === 'lang') {
            strVal = this.$data[k];
          } else {
            strVal = this.$data[k] ? '1' : '0';
          }
          PreferencesManager.saveValue(k, strVal);
          PreferencesManager.preferencesValues.set(k, this.$data[k]);
          this.setPreferencesCSS(this.$data[k], k);
        }
      }
    },
    syncPreferences: function(): void {
      for (const k of PreferencesManager.keys) {
        this.$data[k] = PreferencesManager.preferencesValues.get(k);
        this.setPreferencesCSS(this.$data[k], k);
      }
    },
    getGenMarker: function(): string {
      return `${this.generation}`;
    },
    getOceanCount: function(): string {
      if (this.oceans === MAX_OCEAN_TILES) {
        return '<img src="/assets/misc/checkmark.png" class="preferences_checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${this.oceans}`;
      }
    },
    getTemperatureCount: function(): string {
      if (this.temperature === MAX_TEMPERATURE) {
        return '<img src="/assets/misc/checkmark.png" class="preferences_checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${this.temperature}`;
      }
    },
    getOxygenCount: function(): string {
      if (this.oxygen === MAX_OXYGEN_LEVEL) {
        return '<img src="/assets/misc/checkmark.png" class="preferences_checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${this.oxygen}`;
      }
    },
    getVenusCount: function(): string {
      if (this.venus === MAX_VENUS_SCALE) {
        return '<img src="/assets/misc/checkmark.png" class="preferences_checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${this.venus}`;
      }
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
        return `Mars`;
      } else if (rulingPartyName === PartyName.SCIENTISTS) {
        return `Science`;
      } else if (rulingPartyName === PartyName.KELVINISTS) {
        return `Kelvin`;
      } else {
        return `${rulingPartyName}`;
      }
    },
  },
  mounted: function() {
    this.updatePreferencesFromStorage();
  },
  template: `
        <div class="preferences_cont" :data="syncPreferences()">
                <div class="preferences_tm">
                    <div class="preferences-gen-text">GEN</div>
                    <div class="preferences-gen-marker">{{ getGenMarker() }}</div>
                </div>
                <div v-if="gameOptions.turmoilExtension">
                <div :class="'party-name party-name-indicator party-name--'+rulingPartyToCss()" v-html="getRulingParty()"></div>
                </div>
                <div class="preferences_global_params">
                  <div class="preferences_temperature-tile"></div>
                  <div class="preferences_global_params_value" v-html="getTemperatureCount()"></div>
                  <div class="preferences_oxygen-tile"></div>
                  <div class="preferences_global_params_value" v-html="getOxygenCount()"></div>
                  <div class="preferences_ocean-tile"></div>
                  <div class="preferences_global_params_value" v-html="getOceanCount()"></div>
                  <div v-if="gameOptions.venusNextExtension">
                    <div class="preferences_venus-tile"></div>
                    <div class="preferences_global_params_value" v-html="getVenusCount()"></div>
                  </div>
                </div>
                <div class="preferences_item preferences_player">
                  <div class="preferences_player_inner" :class="'player_bg_color_' + player_color"></div>
                </div>
                <a  href="#board">
                    <div class="preferences_item preferences_item_shortcut">
                        <i class="preferences_icon preferences_icon--board"></i>
                    </div>
                </a>
                <a  href="#actions">
                    <div class="preferences_item preferences_item_shortcut">
                        <i class="preferences_icon preferences_icon--actions"></i>
                    </div>
                </a>
                <a href="#cards">
                    <div class="preferences_item goto-cards preferences_item_shortcut">
                        <i class="preferences_icon preferences_icon--cards"><slot></slot></i>
                    </div>
                </a>
                <a v-if="coloniesCount > 0" href="#colonies">
                    <div class="preferences_item preferences_item_shortcut">
                        <i class="preferences_icon preferences_icon--colonies"></i>
                    </div>
                </a>
                <div class="preferences_item preferences_item--info">
                  <i class="preferences_icon preferences_icon--info"
                  :class="{'preferences_item--is-active': ui.gamesetup_detail_open}"
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
                    <div class="preferences_item preferences_item--help">
                      <i class="preferences_icon preferences_icon--help" :title="$t('player aid')"></i>
                    </div>
                </a>
            <div class="preferences_item preferences_item--settings">
                <i class="preferences_icon preferences_icon--settings" :class="{'preferences_item--is-active': ui.preferences_panel_open}" v-on:click="ui.preferences_panel_open = !ui.preferences_panel_open"></i>
                <div class="preferences_panel" v-if="ui.preferences_panel_open">
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_turnorder" />
                            <i class="form-icon"></i> <span v-i18n>Hide turn order</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_hand" />
                            <i class="form-icon"></i> <span v-i18n>Hide cards in hand</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_cards" />
                            <i class="form-icon"></i> <span v-i18n>Hide played cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_non_blue_cards" />
                            <i class="form-icon"></i> <span v-i18n>Hide non-blue played cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_awards_and_milestones" />
                            <i class="form-icon"></i> <span v-i18n>Hide awards and milestones</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_log" />
                            <i class="form-icon"></i> <span v-i18n>Hide log</span>
                        </label>
                    </div>
                   <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_tag_overview" />
                            <i class="form-icon"></i> <span v-i18n>Hide tag overview</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_corporation_names" />
                            <i class="form-icon"></i> <span v-i18n>Hide corporation names for players</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_top_bar" />
                            <i class="form-icon"></i> <span v-i18n>Hide sticky top bar</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="small_cards" />
                            <i class="form-icon"></i> <span v-i18n>Smaller cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="remove_background" />
                            <i class="form-icon"></i> <span v-i18n>Remove background image</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="magnify_cards" />
                            <i class="form-icon"></i> <span v-i18n>Magnify cards on hover</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="magnify_card_descriptions" />
                            <i class="form-icon"></i> <span v-i18n>Magnify card descriptions on hover</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="show_alerts" />
                            <i class="form-icon"></i> <span v-i18n>Show in-game alerts</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_ma_scores" />
                            <i class="form-icon"></i> <span v-i18n>Hide Milestones / Awards scores</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="enable_sounds" />
                            <i class="form-icon"></i> <span v-i18n>Enable sounds</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="smooth_scrolling" />
                            <i class="form-icon"></i> <span v-i18n>Smooth hotkey scrolling</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_tile_confirmation" />
                            <i class="form-icon"></i> <span v-i18n>Hide tile confirmation</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="show_discount_on_cards" />
                            <i class="form-icon"></i> <span v-i18n>Show discount on cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="show_card_number" />
                            <i class="form-icon"></i> <span v-i18n>Show card numbers (req. refresh)</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="learner_mode" />
                            <i class="form-icon"></i> 
                            <span v-i18n>Learner Mode (req. refresh)</span>
                            <span class="tooltip tooltip-left" data-tooltip="Show information that can be helpful\n to players who are still learning the games">&#9432;</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item form-group">
                        <label class="form-label"><span v-i18n>Language</span> (<a href="javascript:document.location.reload(true);" v-i18n>refresh page</a> <span v-i18n>to see changes</span>)</label>
                        <div class="preferences_panel_langs">
                            <label class="form-radio" v-for="language in langs">
                                <input name="lang" type="radio" v-on:change="updatePreferences" v-model="lang" :value="language.id" />
                                <i class="form-icon"></i> {{ language.title }}
                            </label>
                        </div>
                    </div>

                    <div class="preferences_panel_actions">
                      <button class="btn btn-lg btn-primary" v-on:click="ui.preferences_panel_open=false">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    `,
});
