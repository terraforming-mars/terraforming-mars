export class PreferencesManager {
    static keys: Array<string> = [
        "hide_corporation",
        "hide_hand",
        "hide_cards",
        "hide_awards_and_milestones",
        "hide_tag_overview",
        "hide_turnorder",
        "hide_corporation_names",
        "small_cards",
        "remove_background", 
        "magnify_cards",
        "magnify_card_descriptions",
        "alert_mars_terraformed",
        "hide_ma_scores",
        "hide_non_blue_cards",
        "hide_log",
        "lang",
        "enable_sounds"
    ];

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
