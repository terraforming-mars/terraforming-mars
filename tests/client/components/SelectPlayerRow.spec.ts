import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from './getLocalVue';
import SelectPlayerRow from '@/client/components/SelectPlayerRow.vue';
import {fakePublicPlayerModel} from './testHelpers';

describe('SelectPlayerRow', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectPlayerRow, {
      localVue: getLocalVue(),
      propsData: {
        player: fakePublicPlayerModel(),
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
