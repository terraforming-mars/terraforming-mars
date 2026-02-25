import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import CardRowData from '@/client/components/card/CardRowData.vue';

describe('CardRowData', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CardRowData, {
      ...globalConfig,
      props: {
        rowData: [],
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
