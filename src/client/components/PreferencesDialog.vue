<script lang="ts">
import Vue from 'vue';
import {preferences, PreferencesManager} from '@/client/utils/PreferencesManager';
import {LANGUAGES} from '@/common/constants';

export default Vue.extend({
  name: 'PreferencesDialog',
  data() {
    return {
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
      'experimental_ui': false,
    };
  },
  methods: {
    setPreferencesCSS(
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
    updatePreferencesFromStorage(): Map<
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
    updatePreferences(): void {
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
    syncPreferences(): void {
      for (const k of preferences) {
        this.$data[k] = PreferencesManager.preferencesValues.get(k);
        this.setPreferencesCSS(this.$data[k], k);
      }
    },
    okClicked(): void {
      this.$emit('okButtonClicked');
    },
  },
  mounted() {
    this.updatePreferencesFromStorage();
  },
});
</script>

<template>
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
      <div class="preferences_panel_item">
        <label class="form-switch">
          <input type="checkbox" v-on:change="updatePreferences" v-model="experimental_ui">
          <i class="form-icon"></i>
          <span v-i18n>Experimental UI</span>
          <span class="tooltip tooltip-left" data-tooltip="Test out any possible new experimental UI features for feedback.">&#9432;</span>
        </label>
      </div>
      <div class="preferences_panel_item form-group">
        <label class="form-label"><span v-i18n>Language</span> (<a href="javascript:document.location.reload(true);" v-i18n>refresh page</a> <span v-i18n>to see changes</span>)</label>
        <div class="preferences_panel_langs">
          <label class="form-radio" v-for="language in langs" :key="language.id">
            <input name="lang" type="radio" v-on:change="updatePreferences" v-model="lang" :value="language.id">
            <i class="form-icon"></i> {{ language.title }}
          </label>
        </div>
      </div>


      <div class="preferences_panel_actions">
        <button class="btn btn-lg btn-primary" v-on:click="okClicked">Ok</button>
      </div>
    </div>
</template>
