import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ColonySpace from '@/client/components/colonies/ColonySpace.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('ColonySpace', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColonySpace, {
      ...globalConfig,
      props: {
        idx: 0,
        metadata: getColony(ColonyName.GANYMEDE),
        player: undefined,
        marker: false,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
