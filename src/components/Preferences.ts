
import Vue from "vue";
import { PreferencesManager } from "./PreferencesManger";
import { LANGUAGES } from "../constants";


export const Preferences = Vue.component("preferences", {
    data: function () {
        return {
            "ui": {
                "preferences_panel_open": false
            },
            "hide_corporation": false,
            "hide_hand": false,
            "hide_cards": false,
            "hide_awards_and_milestones": false,
            "hide_turnorder": false,
            "small_cards": false,
            "remove_background": false,
            "magnify_cards": true,
            "magnify_card_descriptions": true,
            "lang": "en",
            "langs": LANGUAGES
        };
    },
    methods: {
        setPreferencesCSS: function(val: boolean | undefined, cssClassSuffix: string): void {
            let target = document.getElementById("ts-preferences-target");
            if ( ! target) return;
            if (val) {
                target.classList.add("preferences_" + cssClassSuffix);
            } else {
                target.classList.remove("preferences_" + cssClassSuffix);
            }

            if ( ! target.classList.contains("language-"+this.lang)) {
                target.classList.add("language-" + this.lang);
            }
        },
        updatePreferencesFromStorage: function (): Map<string, boolean | string>  {
            for (let k of PreferencesManager.keys) {
                let val = PreferencesManager.loadValue(k);
                if (k === "lang") {
                    PreferencesManager.preferencesValues.set(k, this.$data[k]);
                    this[k] = val || "en";
                    PreferencesManager.preferencesValues.set(k, val || "en");
                } else {
                    let boolVal = (val !== "") ? val === "1" : this.$data[k];
                    PreferencesManager.preferencesValues.set(k, val === "1");
                    this.$data[k] = boolVal;
                }
            }
            return PreferencesManager.preferencesValues;
        },
        updatePreferences: function (_evt: any):void {
            var strVal: string = "";
            for (let k of PreferencesManager.keys) {
                let val = PreferencesManager.preferencesValues.get(k);
                if (val !== this.$data[k]) {
                    if (k === "lang") {
                        strVal = this.$data[k];
                    } else {
                        strVal = this.$data[k] ? "1": "0";
                    }
                    PreferencesManager.saveValue(k, strVal);
                    PreferencesManager.preferencesValues.set(k, this.$data[k]);
                    this.setPreferencesCSS(this.$data[k], k);
                }
            }
        },
        syncPreferences: function(): void {
            for (let k of PreferencesManager.keys) {
                this.$data[k] = PreferencesManager.preferencesValues.get(k);
                this.setPreferencesCSS(this.$data[k], k);
            }
        }

    },
    mounted: function () {
        this.updatePreferencesFromStorage();
    },
    template: `
        <div class="preferences_cont" :data="syncPreferences()">
            <div class="preferences_item">
                <a href="#board">
                    <i class="preferences_icon preferences_icon--board"></i>
                </a>
            </div>
            <div class="preferences_item">
                <a href="#actions">
                    <i class="preferences_icon preferences_icon--actions"></i>
                </a>
            </div>
            <div class="preferences_item">
                <a href="#cards">
                    <i class="preferences_icon preferences_icon--cards"></i>
                </a>
            </div>

            <div class="preferences_item preferences_item--settings">
                <i class="preferences_icon preferences_icon--settings" v-on:click="ui.preferences_panel_open = !ui.preferences_panel_open"></i>
                <div class="preferences_panel" v-if="ui.preferences_panel_open">
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_turnorder" />
                            <i class="form-icon"></i> Hide turn order
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_hand" />
                            <i class="form-icon"></i> Hide cards in hand
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_cards" />
                            <i class="form-icon"></i> Hide played cards
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_awards_and_milestones" />
                            <i class="form-icon"></i> Hide awards and milestones
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="small_cards" />
                            <i class="form-icon"></i> Smaller cards
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="remove_background" />
                            <i class="form-icon"></i> Remove background image
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="magnify_cards" />
                            <i class="form-icon"></i> Magnify cards on hover
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label class="form-switch">
                            <input type="checkbox" v-on:change="updatePreferences" v-model="magnify_card_descriptions" />
                            <i class="form-icon"></i> Magnify card descriptions on hover
                        </label>
                    </div>
                    <div class="preferences_panel_item form-group">
                        <label class="form-label">Language (<a href="javascript:document.location.reload(true);">refresh page</a> to see changes)</label>
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
    `
});