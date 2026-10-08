import {expect} from 'chai';
import {createGameSettingsStorage} from '@/client/components/create/createGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';
import {BoardName} from '@/common/boards/BoardName';
import {NewGameConfig} from '@/common/game/NewGameConfig';

describe('CreateGameSettingsStorage', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('saves and reloads game settings', () => {
    const config: Partial<NewGameConfig>  = {
      players: [ {name: 'Alice', color: 'red', beginner: false, handicap: 0, first: true} ],
      board: BoardName.HELLAS,
      solarPhaseOption: true,
      clonedGamedId: 'g123',
    };

    createGameSettingsStorage.save(config as NewGameConfig);

    expect(createGameSettingsStorage.load()).deep.eq({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0, first: true}],
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
      expect(createGameSettingsStorage.load()).eq(undefined);
    } finally {
      console.warn = originalWarn;
    }
    expect(warnings[0][0]).eq('Unable to load create game settings:');
  });

  it('clears saved settings', () => {
    createGameSettingsStorage.save({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      solarPhaseOption: true,
    } as NewGameConfig);

    createGameSettingsStorage.clear();

    expect(createGameSettingsStorage.load()).eq(undefined);
  });
});
