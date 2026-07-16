import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import ShiftAresGlobalParameters from '@/client/components/ShiftAresGlobalParameters.vue';
import {ShiftAresGlobalParametersModel} from '@/common/models/PlayerInputModel';

describe('ShiftAresGlobalParameters', () => {
  const mockPlayerModel: ShiftAresGlobalParametersModel = {
    title: 'Testing, baby!',
    buttonLabel: 'Click me!',
    type: 'aresGlobalParameters',
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
  };

  it('sets up data', () => {
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
