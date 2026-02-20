import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import ColonySpace from '@/client/components/colonies/ColonySpace.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('ColonySpace', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColonySpace, {
      localVue: getLocalVue(),
      propsData: {
        idx: 0,
        metadata: getColony(ColonyName.GANYMEDE),
        player: undefined,
        marker: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
