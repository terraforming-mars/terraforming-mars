import Vue from 'vue';
import {preferences, PreferencesManager} from './PreferencesManager';
import {LANGUAGES} from '../constants';
import {GameOptionsModel} from '../models/GameOptionsModel';
import {TranslateMixin} from './TranslateMixin';

export const PreferencesDialog = Vue.component('preferences-dialog', {
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
  },
  components: {
  },
  mixins: [TranslateMixin],
  data: function() {
    return {
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
      for (const k of preferences) {
        const val = PreferencesManager.load(k);
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
      for (const k of preferences) {
        const val = PreferencesManager.preferencesValues.get(k);
        if (val !== this.$data[k]) {
          if (k === 'lang') {
            strVal = this.$data[k];
          } else {
            strVal = this.$data[k] ? '1' : '0';
          }
          PreferencesManager.save(k, strVal);
          PreferencesManager.preferencesValues.set(k, this.$data[k]);
          this.setPreferencesCSS(this.$data[k], k);
        }
      }
    },
    syncPreferences: function(): void {
      for (const k of preferences) {
        this.$data[k] = PreferencesManager.preferencesValues.get(k);
        this.setPreferencesCSS(this.$data[k], k);
      }
    },
    okClicked: function(): void {
      this.$emit('okButtonClicked');
    },
  },
  mounted: function() {
    this.updatePreferencesFromStorage();
  },
  template: `
    <div class="preferences_panel" :data="syncPreferences()">
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="hide_hand">
          <i class="form-icon"></i> <span v-i18n>Hide cards in hand</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="hide_awards_and_milestones">
          <i class="form-icon"></i> <span v-i18n>Hide awards and milestones</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="small_cards">
          <i class="form-icon"></i> <span v-i18n>Smaller cards</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="magnify_cards">
          <i class="form-icon"></i> <span v-i18n>Magnify cards on hover</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="hide_discount_on_cards">
          <i class="form-icon"></i> <span v-i18n>Hide discount on cards</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="show_card_number">
          <i class="form-icon"></i> <span v-i18n>Show card numbers (req. refresh)</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="remove_background">
          <i class="form-icon"></i> <span v-i18n>Remove background image</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="show_alerts">
          <i class="form-icon"></i> <span v-i18n>Show in-game alerts</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="enable_sounds">
          <i class="form-icon"></i> <span v-i18n>Enable sounds</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="hide_animated_sidebar">
          <i class="form-icon"></i> <span v-i18n>Hide sidebar notification</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="hide_tile_confirmation">
          <i class="form-icon"></i> <span v-i18n>Hide tile confirmation</span>
        </label>
      </div>
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="learner_mode">
          <i class="form-icon"></i>
          <span v-i18n>Learner Mode (req. refresh)</span>
          <span class="tooltip tooltip-left" data-tooltip="Show information that can be helpful\n to players who are still learning the games">&#9432;</span>
        </label>
      </div>
      <div class="preferences_panel_item form-group">
        <label class="form-label"><span v-i18n>Language</span> (<a href="javascript:document.location.reload(true);" v-i18n>refresh page</a> <span v-i18n>to see changes</span>)</label>
        <div class="preferences_panel_langs">
          <label class="form-radio" v-for="language in langs">
            <input name="lang" type="radio" v-on:change="updatePreferences" v-model="lang" :value="language.id">
            <i class="form-icon"></i> {{ language.title }}
          </label>
        </div>
      </div>


      <div class="preferences_panel_actions">
        <button class="btn btn-lg btn-primary" v-on:click="okClicked">Ok</button>
      </div>
    </div>
  </div>
    `,
});
