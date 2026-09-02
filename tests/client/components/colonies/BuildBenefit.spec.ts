import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import BuildBenefit from '@/client/components/colonies/BuildBenefit.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('BuildBenefit', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(BuildBenefit, {
      ...globalConfig,
      props: {
        metadata: getColony(ColonyName.GANYMEDE),
        idx: 0,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
