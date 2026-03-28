import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import ColonyRow from '@/client/components/colonies/ColonyRow.vue';
import {ColonyName} from '@/common/colonies/ColonyName';
import {getColony} from '@/client/colonies/ClientColonyManifest';

describe('ColonyRow', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(ColonyRow, {
      ...globalConfig,
      props: {
        metadata: getColony(ColonyName.GANYMEDE),
        colony: {
          colonies: [],
          isActive: false,
          name: ColonyName.GANYMEDE,
          trackPosition: 1,
          visitor: undefined,
        },
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
