import {JSONObject} from '@/common/Types';

const LAST_SETTINGS_KEY = 'tm_last_game_settings';

function localStorageAvailable(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function sanitizeSettings(settings: JSONObject): JSONObject {
  const sanitized = JSON.parse(JSON.stringify(settings)) as JSONObject;
  delete sanitized.clonedGamedId;
  return sanitized;
}

export class CreateGameSettingsStorage {
  static saveLastSettings(settings: JSONObject): void {
    if (!localStorageAvailable()) {
      return;
    }
    try {
      localStorage.setItem(LAST_SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)));
    } catch {
      // Ignore storage quota and privacy-mode failures.
    }
  }

  static getLastSettings(): JSONObject | undefined {
    if (!localStorageAvailable()) {
      return undefined;
    }
    try {
      const data = localStorage.getItem(LAST_SETTINGS_KEY);
      if (data === null) {
        return undefined;
      }
      const settings = JSON.parse(data) as JSONObject;
      return sanitizeSettings(settings);
    } catch {
      return undefined;
    }
  }

  static clearLastSettings(): void {
    if (!localStorageAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(LAST_SETTINGS_KEY);
    } catch {
      // Ignore privacy-mode failures.
    }
  }
}
