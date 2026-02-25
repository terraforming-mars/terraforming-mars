import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ColonyTradeRow from '@/client/components/colonies/ColonyTradeRow.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('ColonyTradeRow', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColonyTradeRow, {
      ...globalConfig,
      props: {
        metadata: getColony(ColonyName.GANYMEDE),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
