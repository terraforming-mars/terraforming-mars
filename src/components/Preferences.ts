
import Vue from "vue";


class PreferencesManager {
    static keys: Array<string> = ["hide_corporation", "hide_hand", "hide_cards", "hide_awards_and_milestones", "small_cards"];
    static preferencesValues: Map<string, boolean> = new Map<string, boolean>();
    static localStorageSupported: boolean = typeof window['localStorage'] != "undefined" && window['localStorage'] != null;

    static saveValue(name: string, val: string): void {
        if ( ! PreferencesManager.localStorageSupported) return;
        localStorage.setItem(name, val);
    }

    static loadValue(name: string): string {
        if ( ! PreferencesManager.localStorageSupported) return "";
        const value = localStorage.getItem(name);
        if (value === null) return "";
        return value
    }
}

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
            "small_cards": false
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
        },
        updatePreferencesFromCookies: function (): Map<string, boolean>  {
            for (let k of PreferencesManager.keys) {
                let val = PreferencesManager.loadValue(k);
                let boolVal = (val !== "") ? val === "1" : this.$data[k];
                PreferencesManager.preferencesValues.set(k, val === "1");
                this.$data[k] = boolVal;
            }
            return PreferencesManager.preferencesValues;
        },
        updatePreferences: function (_evt: any, initial: boolean = false):void {
            for (let k of PreferencesManager.keys) {
                let val = PreferencesManager.preferencesValues.get(k);
                if (val !== this.$data[k] || initial) {
                    if ( ! initial) {
                        let strVal = this.$data[k] ? "1": "0";
                        PreferencesManager.saveValue(k, strVal);
                        PreferencesManager.preferencesValues.set(k, this.$data[k]);
                    }
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
        this.updatePreferencesFromCookies();
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
                        <label>
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_corporation" />
                            <span>Hide corporation card</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label>
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_hand" />
                            <span>Hide cards in hand</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label>
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_cards" />
                            <span>Hide played cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label>
                            <input type="checkbox" v-on:change="updatePreferences" v-model="hide_awards_and_milestones" />
                            <span>Hide awards and milestones</span>
                        </label>
                    </div>
                    <div class="preferences_panel_item">
                        <label>
                            <input type="checkbox" v-on:change="updatePreferences" v-model="small_cards" />
                            <span>Smaller cards</span>
                        </label>
                    </div>
                    <div class="preferences_panel_actions">
                        <button class="nes-btn is-primary" v-on:click="ui.preferences_panel_open=false">Ok</button>
                    </div>
                </div>
            </div>
        </div>
    `
});