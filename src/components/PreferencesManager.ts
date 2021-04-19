export class PreferencesManager {
    static keys: Array<string> = [
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
    ];

    static preferencesValues: Map<string, boolean | string> = new Map<string, boolean | string>();
    private static localStorageSupported(): boolean {
      return typeof localStorage !== 'undefined';
    }

    static saveValue(name: string, val: string): void {
      if ( ! PreferencesManager.localStorageSupported()) return;
      localStorage.setItem(name, val);
    }

    static loadValue(name: string): string {
      if ( ! PreferencesManager.localStorageSupported()) return '';
      const value = localStorage.getItem(name);
      if (value === null) return '';
      return value;
    }

    static loadBooleanValue(name: string): boolean {
      if ( ! PreferencesManager.localStorageSupported()) return false;
      return localStorage.getItem(name) === '1';
    }
}
