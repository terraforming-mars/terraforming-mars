import {mount, shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CreateGameForm from '@/client/components/create/CreateGameForm.vue';
import {CreateGameSettingsStorage} from '@/client/components/create/CreateGameSettingsStorage';
import {FakeLocalStorage} from '../FakeLocalStorage';
import {BoardName} from '@/common/boards/BoardName';
import {DEFAULT_EXPANSIONS} from '@/common/cards/GameModule';
import {JSONObject} from '@/common/Types';
import {defineComponent} from 'vue';
import {NewGameConfig} from '@/common/game/NewGameConfig';
import {CardName} from '@/common/cards/CardName';
import {CreateGameModel} from '@/client/components/create/CreateGameModel';

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
 * Serializes a two-player game's settings after `setup` adjusts the form.
 *
 * Accepts every confirmation and collects every alert.
 */
async function serializeTwoPlayerGameSettings(setup: (model: CreateGameModel) => void): Promise<{config: NewGameConfig | undefined, alerts: Array<string>}> {
  const originalAlert = global.alert;
  const originalConfirm = global.confirm;
  const alerts: Array<string> = [];
  global.alert = ((message: string) => alerts.push(message)) as typeof alert;
  global.confirm = (() => true) as typeof confirm;

  try {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    const model = wrapper.vm as unknown as CreateGameModel;
    model.playersCount = 2;
    setup(model);
    const config = await (wrapper.vm as any).serializeSettings();
    return {config, alerts};
  } finally {
    global.alert = originalAlert;
    global.confirm = originalConfirm;
  }
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
    new CreateGameSettingsStorage(localStorage).saveSettings(createNewGameConfig({
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

    new CreateGameSettingsStorage(localStorage).saveSettings(createNewGameConfig({
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
    const settingsStorage = new CreateGameSettingsStorage(localStorage);
    settingsStorage.saveSettings(createNewGameConfig());

    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.HELLAS);

    (wrapper.vm as any).resetSettings();
    await wrapper.vm.$nextTick();

    expect((wrapper.vm as any).board).eq(BoardName.THARSIS);
    expect((wrapper.vm as any).draftVariant).eq(true);
    expect(settingsStorage.loadSettings()).eq(undefined);
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

      const savedSettings = new CreateGameSettingsStorage(localStorage).loadSettings();
      expect(savedSettings?.board).eq(BoardName.ELYSIUM);
      expect((savedSettings?.players as Array<{name: string}>).map((player) => player.name)).deep.eq(['Alice', 'Bob']);
    } finally {
      global.fetch = originalFetch;
      global.alert = originalAlert;
    }
  });
  it('requires enough custom corporations for every player', async () => {
    const tooFew = await serializeTwoPlayerGameSettings((model) => model.customCorporations = cardNames(3));
    expect(tooFew.config).is.undefined;
    expect(tooFew.alerts).deep.eq(['Must select at least 4 corporations']);

    const enough = await serializeTwoPlayerGameSettings((model) => model.customCorporations = cardNames(4));
    expect(enough.config?.customCorporationsList).has.length(4);
    expect(enough.alerts).is.empty;
  });

  it('requires enough custom preludes for every player', async () => {
    const tooFew = await serializeTwoPlayerGameSettings((model) => model.customPreludes = cardNames(7));
    expect(tooFew.config).is.undefined;
    expect(tooFew.alerts).deep.eq(['Must select at least 8 Preludes']);

    const enough = await serializeTwoPlayerGameSettings((model) => model.customPreludes = cardNames(8));
    expect(enough.config?.customPreludes).has.length(8);
    expect(enough.alerts).is.empty;
  });

  it('requires enough custom CEOs for every player', async () => {
    const tooFew = await serializeTwoPlayerGameSettings((model) => model.customCeos = cardNames(5));
    expect(tooFew.config).is.undefined;
    expect(tooFew.alerts).deep.eq(['Must select at least 6 CEOs']);

    const enough = await serializeTwoPlayerGameSettings((model) => model.customCeos = cardNames(6));
    expect(enough.config?.customCeos).has.length(6);
    expect(enough.alerts).is.empty;
  });

  it('requires enough custom CEOs for more than the minimum starting CEOs', async () => {
    const tooFew = await serializeTwoPlayerGameSettings((model) => {
      model.startingCeos = 4;
      model.customCeos = cardNames(7);
    });
    expect(tooFew.config).is.undefined;
    expect(tooFew.alerts).deep.eq(['Must select at least 8 CEOs']);
  });

  it('requires the minimum number of custom CEOs even with fewer starting CEOs', async () => {
    const tooFew = await serializeTwoPlayerGameSettings((model) => {
      model.startingCeos = 1;
      model.customCeos = cardNames(5);
    });
    expect(tooFew.config).is.undefined;
    expect(tooFew.alerts).deep.eq(['Must select at least 6 CEOs']);
  });
});
