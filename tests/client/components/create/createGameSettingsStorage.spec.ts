import {expect} from 'chai';
import {createGameSettingsStorage} from '@/client/components/create/createGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';
import {BoardName} from '@/common/boards/BoardName';
import {NewGameConfig} from '@/common/game/NewGameConfig';
import {RandomBoardOption} from '@/common/boards/RandomBoardOption';
import {JSONProcessor} from '@/client/components/create/JSONProcessor';
import {defaultCreateGameModel} from '@/client/components/create/defaultCreateGameModel';

const PLAYER = {name: 'Alice', color: 'red', beginner: false, handicap: 0, first: true} as const;
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
      players: [PLAYER],
      boards: [BoardName.HELLAS],
      solarPhaseOption: true,
      clonedGamedId: 'g123',
    };

    createGameSettingsStorage.save(config as NewGameConfig);

    expect(createGameSettingsStorage.load()).deep.eq({
      players: [PLAYER],
      boards: ['hellas'],
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
      players: [PLAYER],
      boards: ['hellas'],
      solarPhaseOption: true,
    } as NewGameConfig);

    createGameSettingsStorage.clear();

    expect(createGameSettingsStorage.load()).eq(undefined);
  });

  it('loads old fashioned settings correctly', () => {
    localStorage.setItem('tm_last_game_settings', JSON.stringify({
      players: [PLAYER],
      board: RandomBoardOption.OFFICIAL,
      solarPhaseOption: true,
    }));

    const model = defaultCreateGameModel();
    const processor = new JSONProcessor(model);
    processor.applyJSON(createGameSettingsStorage.load()!);

    expect(processor.warnings).is.empty;
    expect(model.boards).deep.eq([
      BoardName.THARSIS,
      BoardName.HELLAS,
      BoardName.ELYSIUM,
      BoardName.UTOPIA_PLANITIA,
      BoardName.VASTITAS_BOREALIS_NOVA,
      BoardName.TERRA_CIMMERIA_NOVA,
    ]);
  });

  it('loads old fashioned settings correctly - b', () => {
    localStorage.setItem('tm_last_game_settings', JSON.stringify({
      players: [PLAYER],
      board: BoardName.TERRA_CIMMERIA,
      solarPhaseOption: true,
    }));

    const model = defaultCreateGameModel();
    const processor = new JSONProcessor(model);
    processor.applyJSON(createGameSettingsStorage.load()!);

    expect(processor.warnings).is.empty;
    expect(model.boards).deep.eq([BoardName.TERRA_CIMMERIA]);
  });
});
