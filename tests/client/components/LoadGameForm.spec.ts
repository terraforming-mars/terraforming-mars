import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import LoadGameForm from '@/client/components/LoadGameForm.vue';

describe('LoadGameForm', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(LoadGameForm, {
      ...globalConfig,
      parentComponent: {
        data() {
          return {
            game: undefined,
            screen: 'empty',
          };
        },
        methods: {
          getVisibilityState: () => false,
          setVisibilityState: () => {},
        },
      } as any,
    });
    expect(wrapper.exists()).to.be.true;
  });
});
