import {expect} from 'chai';
import {CreateGameSettingsStorage} from '@/client/components/create/CreateGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';

describe('CreateGameSettingsStorage', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('saves and reloads the last game settings', () => {
    CreateGameSettingsStorage.saveLastSettings({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      clonedGamedId: 'g123',
      solarPhaseOption: true,
    });

    expect(CreateGameSettingsStorage.getLastSettings()).deep.eq({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      solarPhaseOption: true,
    });
  });

  it('ignores invalid saved data', () => {
    localStorage.setItem('tm_last_game_settings', '{bad json');

    expect(CreateGameSettingsStorage.getLastSettings()).eq(undefined);
  });

  it('clears saved settings', () => {
    CreateGameSettingsStorage.saveLastSettings({
      players: [{name: 'Alice', color: 'red', beginner: false, handicap: 0}],
      board: 'hellas',
      solarPhaseOption: true,
    });

    CreateGameSettingsStorage.clearLastSettings();

    expect(CreateGameSettingsStorage.getLastSettings()).eq(undefined);
  });
});
