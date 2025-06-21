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
import {PartyName} from '@/common/turmoil/PartyName';
import {RecursivePartial} from '@/common/utils/utils';

describe('PlayerInputFactory', () => {
  it('AndOptions', async () => {
    runTest({
      type: 'and',
      options: [],
    });
  });

  it('OrOptions', async () => {
    runTest({
      type: 'or',
      options: [],
    });
  });

  it('SelectAmount', async () => {
    runTest({
      type: 'amount',
    });
  });

  it('SelectAmount', async () => {
    runTest({
      type: 'card',
    });
  });

  it('SelectOption', async () => {
    runTest({
      type: 'option',
    });
  });

  it('SelectPayment', async () => {
    runTest({
      type: 'payment',
      paymentOptions: {},
    });
  });

  it('SelectProjectCardToPlay', async () => {
    runTest({
      type: 'projectCard',
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
      type: 'initialCards',
      options: [
        {type: 'card', title: SELECT_CORPORATION_TITLE} as SelectCardModel,
        {type: 'card', title: SELECT_PROJECTS_TITLE} as SelectCardModel,
      ],
    });
  });

  it('SelectSpace', async () => {
    runTest({
      type: 'space',
    });
  });

  it('SelectPlayer', async () => {
    runTest({
      type: 'player',
    });
  });

  it('SelectParty', async () => {
    runTest({
      type: 'party',
      parties: [PartyName.GREENS, PartyName.REDS],
    });
  });

  it('SelectColony', async () => {
    runTest({
      type: 'colony',
    });
  });

  it('SelectProductionToLose', async () => {
    runTest({
      type: 'productionToLose',
      payProduction: {
        cost: 0,
        units: Units.EMPTY,
      },
    });
  });

  it('ShiftAresGlobalParameters', async () => {
    runTest({
      type: 'aresGlobalParameters',
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

  const playerView: RecursivePartial<PlayerViewModel> = {
    id: 'p-player-id',
    dealtCorporationCards: [],
    thisPlayer: thisPlayer as PublicPlayerModel,
    game: {
      turmoil: {},
    },
  };

  const component = mount(PlayerInputFactory, {
    localVue: getLocalVue(),
    propsData: {
      players: [],
      playerView: playerView,
      playerinput: fullInput,
      onsave: () => {
      },
      showsave: true,
      showtitle: true,
    },
  });
  expect(component).not.is.undefined;
  expect((component.vm as any).$children[0].saveData).not.is.undefined;
}
