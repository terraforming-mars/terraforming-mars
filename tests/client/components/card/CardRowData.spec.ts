import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {getLocalVue} from '../getLocalVue';
import CardRowData from '@/client/components/card/CardRowData.vue';

describe('CardRowData', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRowData, {
      localVue: getLocalVue(),
      propsData: {
        rowData: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
