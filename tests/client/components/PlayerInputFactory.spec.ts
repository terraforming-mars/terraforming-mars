import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import {PlayerInputType} from '@/common/input/PlayerInputType';
import {CardModel} from '@/common/models/CardModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';
import {SELECT_CORPORATION_TITLE, SELECT_PROJECTS_TITLE} from '@/common/inputs/SelectInitialCards';

describe('PlayerInputFactory2', function() {
  it('AndOptions', async () => {
    runTest({
      inputType: PlayerInputType.AND_OPTIONS,
      options: [],
    });
  });

  it('OrOptions', async () => {
    runTest({
      inputType: PlayerInputType.OR_OPTIONS,
      options: [],
    });
  });

  it('SelectAmount', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_AMOUNT,
    });
  });

  it('SelectAmount', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_CARD,
    });
  });

  it('SelectOption', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_OPTION,
    });
  });

  it('SelectPayment', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_PAYMENT,
    });
  });

  it('SelectProjectCardToPlay', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY,
      cards: [{name: CardName.ANTS, reserveUnits: {}} as CardModel],
    });
  });

  it('SelectInitialCards', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_INITIAL_CARDS,
      options: [
        {title: SELECT_CORPORATION_TITLE} as PlayerInputModel,
        {title: SELECT_PROJECTS_TITLE} as PlayerInputModel,
      ],
    });
  });

  it('SelectSpace', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_SPACE,
    });
  });

  it('SelectPlayer', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_PLAYER,
    });
  });

  it('SelectPartyToSendDelegate', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_PARTY_TO_SEND_DELEGATE,
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
      inputType: PlayerInputType.SELECT_COLONY,
    });
  });

  it('SelectProductionToLose', async () => {
    runTest({
      inputType: PlayerInputType.SELECT_PRODUCTION_TO_LOSE,
      payProduction: {
        cost: 0,
        units: Units.EMPTY,
      },
    });
  });

  it('ShiftAresGlobalParameters', async () => {
    runTest({
      inputType: PlayerInputType.SHIFT_ARES_GLOBAL_PARAMETERS,
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

function runTest(playerInput: Partial<PlayerInputModel>) {
  const baseInput: Partial<PlayerInputModel> = {
    amount: undefined,
    availableSpaces: undefined,
    canUseHeat: undefined,
    canUseSteel: undefined,
    canUseTitanium: undefined,
    canUseLunaTradeFederationTitanium: undefined,
    canUseSeeds: undefined,
    canUseData: undefined,
    cards: undefined,
    options: undefined,
    min: undefined,
    max: undefined,
    microbes: undefined,
    floaters: undefined,
    science: undefined,
    seeds: undefined,
    auroraiData: undefined,
    title: 'test input',
    players: undefined,
    buttonLabel: 'save',
    coloniesModel: undefined,
    selectBlueCardAction: false,
    availableParties: undefined,
    showReset: false,
  };

  const fullPlayerInput: Partial<PlayerInputModel> = {...baseInput, ...playerInput};

  const component = mount(PlayerInputFactory, {
    localVue: getLocalVue(),
    propsData: {
      players: [],
      playerView: {
        id: 'foo',
        dealtCorporationCards: [],
      },
      playerinput: fullPlayerInput,
      onsave: function() {
      },
      showsave: true,
      showtitle: true,
    },
  });
  expect(component).not.is.undefined;
  expect((component.vm as any).$children[0].saveData).not.is.undefined;
}
