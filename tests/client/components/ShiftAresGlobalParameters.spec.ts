import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import ShiftAresGlobalParameters from '@/client/components/ShiftAresGlobalParameters.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PartyName} from '@/common/turmoil/PartyName';

describe('ShiftAresGlobalParameters', function() {
  const mockPlayerModel: PlayerInputModel = {
    title: 'Testing, baby!',
    buttonLabel: 'Click me!',
    inputType: 'aresGlobalParameters',
    amount: undefined,
    options: undefined,
    cards: undefined,
    max: undefined,
    min: undefined,
    canUseSteel: undefined,
    canUseTitanium: undefined,
    canUseLunaTradeFederationTitanium: undefined,
    canUseHeat: undefined,
    canUseSeeds: undefined,
    canUseData: undefined,
    players: undefined,
    availableSpaces: undefined,
    availableParties: [PartyName.MARS, PartyName.SCIENTISTS, PartyName.UNITY, PartyName.GREENS, PartyName.REDS, PartyName.KELVINISTS],
    microbes: undefined,
    floaters: undefined,
    science: undefined,
    seeds: undefined,
    auroraiData: undefined,
    coloniesModel: undefined,
    payProduction: undefined,
    aresData: {
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
    showReset: false,
  };

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
    });
  });
});
