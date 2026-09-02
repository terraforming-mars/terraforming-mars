import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectColony from '@/client/components/SelectColony.vue';
import {PlayerViewModel} from '@/common/models/PlayerModel';

describe('SelectColony', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectColony, {
      ...globalConfig,
      props: {
        playerView: {} as PlayerViewModel,
        playerinput: {
          title: 'Select a colony',
          buttonLabel: 'Save',
          type: 'colony',
          coloniesModel: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
