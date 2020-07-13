export class PreferencesManager {
    static keys: Array<string> = ["hide_corporation", "hide_hand", "hide_cards", "hide_awards_and_milestones", "hide_turnorder", "small_cards", "remove_background", "magnify_cards", "magnify_card_descriptions", "alert_mars_terraformed", "lang"];
    static preferencesValues: Map<string, boolean | string> = new Map<string, boolean | string>();
    static localStorageSupported: boolean = typeof window["localStorage"] !== undefined && window["localStorage"] !== null;

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