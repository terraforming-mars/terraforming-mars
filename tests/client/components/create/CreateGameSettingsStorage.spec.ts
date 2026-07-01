import {expect} from 'chai';
import {CreateGameSettingsStorage} from '@/client/components/create/CreateGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';

describe('CreateGameSettingsStorage', () => {
  let localStorage: FakeLocalStorage;
  let storage: CreateGameSettingsStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    storage = new CreateGameSettingsStorage(localStorage);
  });

  it('saves and reloads game settings', () => {
    storage.saveSettings({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      clonedGamedId: 'g123',
      solarPhaseOption: true,
    });

    expect(storage.loadSettings()).deep.eq({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      solarPhaseOption: true,
    });
  });

  it('ignores invalid saved data', () => {
    const warnings: Array<Array<unknown>> = [];
    const originalWarn = console.warn;
    console.warn = (...args) => {
      warnings.push(args);
    };
    localStorage.setItem('tm_last_game_settings', '{bad json');

    try {
      expect(storage.loadSettings()).eq(undefined);
    } finally {
      console.warn = originalWarn;
    }
    expect(warnings[0][0]).eq('Unable to load create game settings:');
  });

  it('clears saved settings', () => {
    storage.saveSettings({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      solarPhaseOption: true,
    });

    storage.clearSettings();

    expect(storage.loadSettings()).eq(undefined);
  });
});
