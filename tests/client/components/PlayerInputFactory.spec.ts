import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import PlayerInputFactory from '@/client/components/PlayerInputFactory.vue';
import {PlayerInputType} from '@/common/input/PlayerInputType';
import {CardModel} from '@/common/models/CardModel';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {Units} from '@/common/Units';
import {CardName} from '@/common/cards/CardName';

const baseInput = {
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
  data: undefined,
  title: 'test input',
  players: undefined,
  buttonLabel: 'save',
  coloniesModel: undefined,
  selectBlueCardAction: false,
  availableParties: undefined,
};

const typesToTest: PlayerInputModel[] = [
  {
    ...baseInput,
    inputType: PlayerInputType.AND_OPTIONS,
    options: [],
  },
  {
    ...baseInput,
    inputType: PlayerInputType.OR_OPTIONS,
    options: [],
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_AMOUNT,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_CARD,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_OPTION,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_PAYMENT,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_PROJECT_CARD_TO_PLAY,
    cards: [{name: CardName.ANTS, reserveUnits: {}} as CardModel],
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_INITIAL_CARDS,
    options: [
        {} as PlayerInputModel,
        {} as PlayerInputModel,
    ],
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_SPACE,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_PLAYER,
  },
  {
    ...baseInput,
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
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_COLONY,
  },
  {
    ...baseInput,
    inputType: PlayerInputType.SELECT_PRODUCTION_TO_LOSE,
    payProduction: {
      cost: 0,
      units: Units.EMPTY,
    },
  },
  {
    ...baseInput,
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
  },
];

describe('PlayerInputFactory', function() {
  for (const playerinput of typesToTest) {
    it(`saves data for ${playerinput.inputType}`, async function() {
      const component = mount(PlayerInputFactory, {
        localVue: getLocalVue(),
        propsData: {
          players: [],
          playerView: {
            id: 'foo',
            dealtCorporationCards: [],
          },
          playerinput,
          onsave: function() {
          },
          showsave: true,
          showtitle: true,
        },
      });
      expect(component).not.is.undefined;
      expect((component.vm as any).$children[0].saveData).not.is.undefined;
    });
  }
});
