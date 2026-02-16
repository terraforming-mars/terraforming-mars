import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectSpace from '@/client/components/SelectSpace.vue';
import {FakeLocalStorage} from './FakeLocalStorage';

describe('SelectSpace', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectSpace, {
      ...globalConfig,
      props: {
        playerinput: {
          title: 'Select a space',
          buttonLabel: 'Save',
          type: 'space',
          spaces: [],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });
});
