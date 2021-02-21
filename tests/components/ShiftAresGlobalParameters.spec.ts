import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {ShiftAresGlobalParameters} from '../../src/components/ShiftAresGlobalParameters';
import {PlayerInputModel} from '../../src/models/PlayerInputModel';
import {PlayerInputTypes} from '../../src/PlayerInputTypes';
import {PartyName} from '../../src/turmoil/parties/PartyName';

describe('ShiftAresGlobalParameters', function() {
  const mockPlayerModel: PlayerInputModel = {
    title: 'Testing, baby!',
    buttonLabel: 'Click me!',
    inputType: PlayerInputTypes.SHIFT_ARES_GLOBAL_PARAMETERS,
    amount: undefined,
    options: undefined,
    cards: undefined,
    maxCardsToSelect: undefined,
    minCardsToSelect: undefined,
    canUseSteel: undefined,
    canUseTitanium: undefined,
    canUseHeat: undefined,
    players: undefined,
    availableSpaces: undefined,
    availableParties: [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY, PartyName.GREENS, PartyName.REDS, PartyName.KELVINISTS],
    min: undefined,
    max: undefined,
    microbes: undefined,
    floaters: undefined,
    coloniesModel: undefined,
    payProduction: undefined,
    aresData: {
      active: true,
      includeHazards: true,
      hazardData: {
        erosionOceanCount: {
          threshold: 3,
          available: true,
        },
        removeDustStormsOceanCount: {
          threshold: 6,
          available: true,
        },
        severeErosionTemperature: {
          threshold: -4,
          available: true,
        },
        severeDustStormOxygen: {
          threshold: 5,
          available: true,
        },
      },
      milestoneResults: [],
    },
    selectBlueCardAction: false,
  };
  function getLocalVue() {
    const localVue = createLocalVue();
    return localVue;
  }
  it('sets up data', function() {
    const playerinput = mockPlayerModel;
    const ares = mount(ShiftAresGlobalParameters, {
      localVue: getLocalVue(),
      propsData: {
        playerinput,
      },
    });
    expect(
      ares.vm.$data,
    ).to.deep.eq({
      hazardData: {
        erosionOceanCount: {threshold: 3, available: true},
        removeDustStormsOceanCount: {threshold: 6, available: true},
        severeErosionTemperature: {threshold: -4, available: true},
        severeDustStormOxygen: {threshold: 5, available: true},
      },
      lowOceanDelta: 0,
      highOceanDelta: 0,
      temperatureDelta: 0,
      oxygenDelta: 0,
      ADJUSTMENT_RANGE: [-1, 0, 1],
    });
  });
});
