import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import BuildBenefit from '@/client/components/colonies/BuildBenefit.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('BuildBenefit', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BuildBenefit, {
      localVue: getLocalVue(),
      propsData: {
        metadata: getColony(ColonyName.GANYMEDE),
        idx: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
