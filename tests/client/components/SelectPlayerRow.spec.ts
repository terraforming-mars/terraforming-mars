import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {fakePublicPlayerModel} from './testHelpers';

describe('SelectPlayerRow', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectPlayerRow, {
      ...globalConfig,
      props: {
        player: fakePublicPlayerModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
