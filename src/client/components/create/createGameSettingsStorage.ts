import {NewGameConfig} from '@/common/game/NewGameConfig';
import {JSONObject} from '@/common/Types';
import {safeLocalStorage} from '@/client/utils/SafeLocalStorage';

const SETTINGS_KEY = 'tm_last_game_settings';

export const createGameSettingsStorage = {
  save(settings: NewGameConfig): void {
    const sanitized = {...settings};
    delete sanitized.clonedGamedId;
    safeLocalStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
  },

  load(): JSONObject | undefined {
    const data = safeLocalStorage.getItem(SETTINGS_KEY);
    if (data === null) {
      return undefined;
    }
    try {
      return JSON.parse(data) as JSONObject;
    } catch (err) {
      console.warn('Unable to load create game settings:', err);
      return undefined;
    }
  },

  clear(): void {
    safeLocalStorage.removeItem(SETTINGS_KEY);
  },
};
