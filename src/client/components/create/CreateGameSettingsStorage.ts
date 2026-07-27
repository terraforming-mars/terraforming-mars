import {JSONObject} from '@/common/Types';

const SETTINGS_KEY = 'tm_last_game_settings';

function getLocalStorage(): Storage | undefined {
  try {
    // Access can throw SecurityError for opaque origins.
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

function settingsWithoutClonedGameId(settings: JSONObject): JSONObject {
  const sanitized = {...settings};
  delete sanitized.clonedGamedId;
  return sanitized;
}

export class CreateGameSettingsStorage {
  constructor(private readonly storage?: Storage) {
  }

  public saveSettings(settings: JSONObject): void {
    const storage = this.storage ?? getLocalStorage();
    if (storage === undefined) {
      return;
    }
    try {
      storage.setItem(SETTINGS_KEY, JSON.stringify(settingsWithoutClonedGameId(settings)));
    } catch (err) {
      console.warn('Unable to save create game settings:', err);
    }
  }

  public loadSettings(): JSONObject | undefined {
    const storage = this.storage ?? getLocalStorage();
    if (storage === undefined) {
      return undefined;
    }
    try {
      const data = storage.getItem(SETTINGS_KEY);
      if (data === null) {
        return undefined;
      }
      return JSON.parse(data) as JSONObject;
    } catch (err) {
      console.warn('Unable to load create game settings:', err);
      return undefined;
    }
  }

  public clearSettings(): void {
    const storage = this.storage ?? getLocalStorage();
    if (storage === undefined) {
      return;
    }
    try {
      storage.removeItem(SETTINGS_KEY);
    } catch (err) {
      console.warn('Unable to clear create game settings:', err);
    }
  }
}
