export const preferences = [
  'hide_hand',
  'hide_awards_and_milestones',
  'hide_top_bar',
  'small_cards',
  'remove_background',
  'magnify_cards',
  'magnify_card_descriptions',
  'show_alerts',
  'hide_active_cards',
  'hide_automated_cards',
  'hide_event_cards',
  'lang',
  'enable_sounds',
  'hide_tile_confirmation',
  'show_card_number',
  'hide_discount_on_cards',
  'learner_mode',
  'hide_animated_sidebar',
  'experimental_ui',
] as const;

export type Key = typeof preferences[number];

export class PreferencesManager {
  static preferencesValues: Map<Key, boolean | string> = new Map<Key, boolean | string>();
  private static localStorageSupported(): boolean {
    return typeof localStorage !== 'undefined';
  }

  static save(name: Key, val: string | boolean, updateMap: boolean = false): void {
    const stringVal = typeof(val) === 'string' ? val : (val ? '1' : '0');
    if (this.localStorageSupported()) {
      localStorage.setItem(name, stringVal);
    }
    if (updateMap) {
      this.preferencesValues.set(name, stringVal);
    }
  }

  static load(name: Key, defaultValue = ''): string {
    if (!this.localStorageSupported()) return defaultValue;
    const value = localStorage.getItem(name);
    return value ?? defaultValue;
  }

  static loadBoolean(name: Key, defaultValue = false): boolean {
    if (!this.localStorageSupported()) return defaultValue;
    return localStorage.getItem(name) === '1';
  }
}
