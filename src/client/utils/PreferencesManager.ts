export type Preferences = {
  learner_mode: boolean,
  enable_sounds: boolean,
  magnify_cards: boolean,
  show_alerts: boolean,
  hide_hand: boolean,
  hide_awards_and_milestones: boolean,
  hide_top_bar: boolean,
  small_cards: boolean,
  remove_background: boolean,
  hide_active_cards: boolean,
  hide_automated_cards: boolean,
  hide_event_cards: boolean,
  hide_tile_confirmation: boolean,
  hide_discount_on_cards: boolean,
  hide_animated_sidebar: boolean,
  experimental_ui: boolean,
  debug_view: boolean,
  lang: string,
}

export type Preference = keyof Preferences;

const defaults: Preferences = {
  learner_mode: true,
  enable_sounds: true,
  magnify_cards: true,
  show_alerts: true,
  lang: 'en',

  hide_hand: false,
  hide_awards_and_milestones: false,
  hide_top_bar: false,
  small_cards: false,
  remove_background: false,
  hide_active_cards: false,
  hide_automated_cards: false,
  hide_event_cards: false,
  hide_tile_confirmation: false,
  hide_discount_on_cards: false,
  hide_animated_sidebar: false,
  experimental_ui: false,
  debug_view: false,
};

export class PreferencesManager {
  public static INSTANCE = new PreferencesManager();
  private readonly _values: Preferences;

  private localStorageSupported(): boolean {
    return typeof localStorage !== 'undefined';
  }

  public static resetForTest() {
    this.INSTANCE = new PreferencesManager();
  }

  private constructor() {
    this._values = {...defaults};
    for (const key of Object.keys(defaults) as Array<Preference>) {
      const value = this.localStorageSupported() ? localStorage.getItem(key) : undefined;
      if (value) this._set(key, value);
    }
  }

  private _set(key: Preference, val: string | boolean) {
    if (key === 'lang') {
      this._values.lang = String(val);
    } else {
      this._values[key] = typeof(val) === 'boolean' ? val : (val === '1');
    }
  }

  // Making this Readonly means that it's Typescript-impossible to
  // set preferences through the fields themselves.
  values(): Readonly<Preferences> {
    return this._values;
  }

  set(name: Preference, val: string | boolean, setOnChange = false): void {
    // Don't set values if nothing has changed.
    if (setOnChange && this._values[name] === val) return;
    this._set(name, val);
    if (this.localStorageSupported()) {
      if (name === 'lang') {
        localStorage.setItem(name, this._values.lang);
      } else {
        localStorage.setItem(name, val ? '1' : '0');
      }
    }
  }
}

export function getPreferences(): Readonly<Preferences> {
  return PreferencesManager.INSTANCE.values();
}
