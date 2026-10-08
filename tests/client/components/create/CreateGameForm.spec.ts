import {mount, shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CreateGameForm from '@/client/components/create/CreateGameForm.vue';
import {createGameSettingsStorage} from '@/client/components/create/createGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';
import {BoardName} from '@/common/boards/BoardName';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {JSONObject} from '@/common/Types';
import {defineComponent} from 'vue';
import {NewGameConfig} from '@/common/game/NewGameConfig';
import {CardName} from '@/common/cards/CardName';
import {CreateGameModel} from '@/client/components/create/CreateGameModel';
import {ValidationErrors} from '@/common/game/validateNewGameConfig';
import {ColonyName} from '@/common/colonies/ColonyName';

// Minimal serialized Create Game payload used by settings restore tests.
function createNewGameConfig(overrides: JSONObject = {}):  NewGameConfig {
  // Not ideal but is fine for the tests.
  const config: Partial<NewGameConfig> = {
    players: [
      {name: 'Alice', color: 'red', beginner: false, handicap: 0, first: false},
      {name: 'Bob', color: 'blue', beginner: false, handicap: 0, first: true},
    ],
    expansions: DEFAULT_EXPANSIONS,
    board: BoardName.HELLAS,
    draftVariant: false,
    solarPhaseOption: true,
    ...overrides,
  };
  return config as NewGameConfig;
}

/*
 * Returns `count` distinct card names of any type.
 *
 * Suitable only for checks that count a list's cards.
 */
function cardNames(count: number): Array<CardName> {
  return Object.values(CardName).slice(0, count);
}

/*
 * Returns the validation errors for a two-player game after `setup` adjusts the form.
 */
function validateTwoPlayerGame(setup: (model: CreateGameModel) => void): ValidationErrors {
  const wrapper = shallowMount(CreateGameForm, {
    ...globalConfig,
  });
  const model = wrapper.vm as unknown as CreateGameModel;
  model.playersCount = 2;
  setup(model);
  return (wrapper.vm as any).validationErrors;
}

describe('CreateGameForm', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('restores the last saved game settings on load', async () => {
    createGameSettingsStorage.save(createNewGameConfig({
      expansions: {...DEFAULT_EXPANSIONS, venus: true},
    }));

    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).playersCount).eq(2);
    expect((wrapper.vm as any).players[0].name).eq('Alice');
    expect((wrapper.vm as any).players[1].name).eq('Bob');
    expect((wrapper.vm as any).board).eq(BoardName.HELLAS);
    expect((wrapper.vm as any).draftVariant).eq(false);
    expect((wrapper.vm as any).expansions.venus).eq(true);
    expect((wrapper.vm as any).solarPhaseOption).eq(true);
  });

  it('shows warnings when restoring saved settings', async () => {
    const alerts: Array<{title: string, message: string}> = [];
    const Root = defineComponent({
      components: {
        CreateGameForm,
      },
      template: '<CreateGameForm ref="form" />',
    });
    const wrapper = mount(Root, {
      ...globalConfig,
    });
    const form = wrapper.findComponent(CreateGameForm);
    (form.vm.$root as any).showAlert = (title: string, message: string) => {
      alerts.push({title, message});
    };

    createGameSettingsStorage.save(createNewGameConfig({
      customPreludes: ['Bad Prelude Name'],
    }));

    (form.vm as any).restoreLastSettings();
    await form.vm.$nextTick();

    expect(alerts).deep.eq([{
      title: 'Restore settings',
      message: "Settings loaded with these warnings: \nUnknown card name 'Bad Prelude Name' in customPreludes",
    }]);
  });

  it('resets the form and clears saved settings', async () => {
    createGameSettingsStorage.save(createNewGameConfig());

    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.HELLAS);

    (wrapper.vm as any).resetSettings();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.THARSIS);
    expect((wrapper.vm as any).draftVariant).eq(true);
    expect(createGameSettingsStorage.load()).eq(undefined);
    expect(wrapper.findAllComponents({name: 'AppButton'}).map((button) => button.props('title'))).includes('Reset');
  });

  it('clears uploading when applying settings throws', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });

    expect(() => (wrapper.vm as any).applySettings(createNewGameConfig({
      players: [
        {name: 'Alice', color: 'red', beginner: false, handicap: 0},
        {name: 'Bob', color: 'red', beginner: false, handicap: 0},
      ],
    }))).throws('Colors are duplicated');
    expect((wrapper.vm as any).uploading).eq(false);
  });

  it('saves current settings before creating a game', async () => {
    const originalFetch = global.fetch;
    const originalAlert = global.alert;
    global.fetch = (() => Promise.reject(new Error('stop after saving'))) as typeof fetch;
    global.alert = (() => {}) as typeof alert;

    try {
      const wrapper = shallowMount(CreateGameForm, {
        ...globalConfig,
      });
      (wrapper.vm as any).playersCount = 2;
      (wrapper.vm as any).randomFirstPlayer = false;
      (wrapper.vm as any).players[0].name = 'Alice';
      (wrapper.vm as any).players[1].name = 'Bob';
      (wrapper.vm as any).board = BoardName.ELYSIUM;

      await (wrapper.vm as any).createGame();

      const savedSettings = createGameSettingsStorage.load();
      expect(savedSettings?.board).eq(BoardName.ELYSIUM);
      expect((savedSettings?.players as Array<{name: string}>).map((player) => player.name)).deep.eq(['Alice', 'Bob']);
    } finally {
      global.fetch = originalFetch;
      global.alert = originalAlert;
    }
  });
  it('validates the form settings', () => {
    expect(validateTwoPlayerGame((model) => model.customCorporations = cardNames(3)).notEnoughCorporations).eq(4);
    expect(validateTwoPlayerGame((model) => model.customCorporations = cardNames(4)).notEnoughCorporations).eq(0);
  });

  it('ignores unknown colony names when validating', () => {
    const errors = validateTwoPlayerGame((model) => model.customColonies = ['Unknown Colony' as ColonyName]);
    expect(errors.coloniesMissingExpansions).deep.eq([]);
  });

  it('disables Create game when there is a blocking error', async () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    const createGameButton = () => wrapper.findAllComponents({name: 'AppButton'}).find((button) => button.props('title') === 'Create game');
    expect(createGameButton()?.props('disabled')).is.false;
    expect(wrapper.find('.create-game-custom-preludes-warning').exists()).is.false;

    (wrapper.vm as any).playersCount = 2;
    (wrapper.vm as any).customCorporations = cardNames(3);
    await wrapper.vm.$nextTick();

    expect(createGameButton()?.props('disabled')).is.true;
    expect(wrapper.find('.create-game-custom-preludes-warning').exists()).is.true;
  });

  it('replaces a cleared escape velocity field with its default', async () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    const model = wrapper.vm as unknown as CreateGameModel;
    model.playersCount = 2;
    model.escapeVelocityMode = true;
    model.escapeVelocityThreshold = 35;
    // A cleared number input binds as an empty string.
    model.escapeVelocityPeriod = '' as unknown as number;
    const config: NewGameConfig | undefined = await (wrapper.vm as any).serializeSettings();
    expect(config?.escapeVelocity).deep.eq({
      thresholdMinutes: 35,
      bonusSectionsPerAction: 2,
      penaltyPeriodMinutes: 2,
      penaltyVPPerPeriod: 1,
    });
  });
});
