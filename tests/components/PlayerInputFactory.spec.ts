
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import PlayerInputFactory from '@/components/PlayerInputFactory.vue';
import {PlayerInputTypes} from '@/PlayerInputTypes';
import {CardModel} from '@/models/CardModel';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {Units} from '@/Units';
import {CardName} from '@/CardName';

const baseInput = {
  amount: undefined,
  availableSpaces: undefined,
  canUseHeat: undefined,
  canUseSteel: undefined,
  canUseTitanium: undefined,
  cards: undefined,
  options: undefined,
  min: undefined,
  max: undefined,
  maxCardsToSelect: undefined,
  microbes: undefined,
  floaters: undefined,
  science: undefined,
  title: 'test input',
  minCardsToSelect: undefined,
  players: undefined,
  buttonLabel: 'save',
  coloniesModel: undefined,
  selectBlueCardAction: false,
  availableParties: undefined,
};

const typesToTest: PlayerInputModel[] = [
  {
    ...baseInput,
    inputType: PlayerInputTypes.AND_OPTIONS,
    options: [],
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.OR_OPTIONS,
    options: [],
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_AMOUNT,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_CARD,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_OPTION,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_HOW_TO_PAY,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD,
    cards: [{name: CardName.ANTS, reserveUnits: Units.of({})} as CardModel],
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_INITIAL_CARDS,
    options: [
        {} as PlayerInputModel,
        {} as PlayerInputModel,
    ],
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_SPACE,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_PLAYER,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_PARTY_TO_SEND_DELEGATE,
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
    inputType: PlayerInputTypes.SELECT_COLONY,
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SELECT_PRODUCTION_TO_LOSE,
    payProduction: {
      cost: 0,
      units: Units.EMPTY,
    },
  },
  {
    ...baseInput,
    inputType: PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS,
    aresData: {
      active: false,
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
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    return localVue;
  }
  for (const playerinput of typesToTest) {
    it(`saves data for ${playerinput.inputType}`, async function() {
      const component = mount(PlayerInputFactory, {
        localVue: getLocalVue(),
        propsData: {
          players: [],
          playerView: {
            id: 'foo',
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
