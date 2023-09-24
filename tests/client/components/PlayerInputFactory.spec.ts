import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import {CardModel} from '@/common/models/CardModel';
import {PlayerInputModel, SelectCardModel} from '@/common/models/PlayerInputModel';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {SELECT_CORPORATION_TITLE, SELECT_PROJECTS_TITLE} from '@/common/inputs/SelectInitialCards';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';

describe('PlayerInputFactory', function() {
  it('AndOptions', async () => {
    runTest({
      inputType: 'and',
      options: [],
    });
  });

  it('OrOptions', async () => {
    runTest({
      inputType: 'or',
      options: [],
    });
  });

  it('SelectAmount', async () => {
    runTest({
      inputType: 'amount',
    });
  });

  it('SelectAmount', async () => {
    runTest({
      inputType: 'card',
    });
  });

  it('SelectOption', async () => {
    runTest({
      inputType: 'option',
    });
  });

  it('SelectPayment', async () => {
    runTest({
      inputType: 'payment',
      paymentOptions: {},
    });
  });

  it('SelectProjectCardToPlay', async () => {
    runTest({
      inputType: 'projectCard',
      cards: [{name: CardName.ANTS} as CardModel],
      paymentOptions: {},
      floaters: 0,
      graphene: 0,
      kuiperAsteroids: 0,
      lunaArchivesScience: 0,
      microbes: 0,
      seeds: 0,
    });
  });

  it('SelectInitialCards', async () => {
    runTest({
      inputType: 'initialCards',
      options: [
        {inputType: 'card', title: SELECT_CORPORATION_TITLE} as SelectCardModel,
        {inputType: 'card', title: SELECT_PROJECTS_TITLE} as SelectCardModel,
      ],
    });
  });

  it('SelectSpace', async () => {
    runTest({
      inputType: 'space',
    });
  });

  it('SelectPlayer', async () => {
    runTest({
      inputType: 'player',
    });
  });

  it('SelectParty', async () => {
    runTest({
      inputType: 'party',
      turmoil: {
        dominant: undefined,
        ruling: undefined,
        chairman: undefined,
        parties: [],
        lobby: [],
        reserve: [],
        distant: undefined,
        coming: undefined,
        current: undefined,
        politicalAgendas: undefined,
        policyActionUsers: [],
      },
    });
  });

  it('SelectColony', async () => {
    runTest({
      inputType: 'colony',
    });
  });

  it('SelectProductionToLose', async () => {
    runTest({
      inputType: 'productionToLose',
      payProduction: {
        cost: 0,
        units: Units.EMPTY,
      },
    });
  });

  it('ShiftAresGlobalParameters', async () => {
    runTest({
      inputType: 'aresGlobalParameters',
      aresData: {
        includeHazards: false,
        hazardData: {
          erosionOceanCount: {threshold: 0, available: false},
          removeDustStormsOceanCount: {threshold: 0, available: false},
          severeErosionTemperature: {threshold: 0, available: false},
          severeDustStormOxygen: {threshold: 0, available: false},
        },
        milestoneResults: [],
      },
    });
  });
});

// function runTest(playerInput: Omit<PlayerInputModel, 'title' | 'buttonLabel'>) {
function runTest(playerInput: Partial<PlayerInputModel>) {
  // TODO(kberg): this no longer needs to be partial, but needs all the invocations above to change.
  const fullInput: Partial<PlayerInputModel> = {
    title: 'test input',
    buttonLabel: 'save',
    ...playerInput,
  };

  const thisPlayer: Partial<PublicPlayerModel> = {
    steel: 0,
    titanium: 0,
    tableau: [],
  };

  const playerView: Partial<PlayerViewModel> = {
    id: 'p-player-id',
    dealtCorporationCards: [],
    thisPlayer: thisPlayer as PublicPlayerModel,
  };

  const component = mount(PlayerInputFactory, {
    localVue: getLocalVue(),
    propsData: {
      players: [],
      playerView: playerView,
      playerinput: fullInput,
      onsave: function() {
      },
      showsave: true,
      showtitle: true,
    },
  });
  expect(component).not.is.undefined;
  expect((component.vm as any).$children[0].saveData).not.is.undefined;
}
