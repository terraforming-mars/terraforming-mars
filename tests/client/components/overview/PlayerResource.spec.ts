import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import PlayerResource from '@/client/components/overview/PlayerResource.vue';
import {Resource} from '@/common/Resource';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {FakeLocalStorage} from '../FakeLocalStorage';

describe('PlayerResource', () => {
  let localStorage: FakeLocalStorage;
  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
    PreferencesManager.INSTANCE.set('learner_mode', true);
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('Does not show resource value when it is zero', () => {
    const wrapper = shallowMount(PlayerResource, {
      localVue: getLocalVue(),
      propsData: {
        type: Resource.HEAT,
        count: 10,
        production: 1,
      },
    });
    expect(wrapper.find('[data-test="resource-value"]').exists()).is.false;
  });

  it('Show resource value for heat', () => {
    const wrapper = shallowMount(PlayerResource, {
      localVue: getLocalVue(),
      propsData: {
        type: Resource.HEAT,
        count: 10,
        production: 1,
        value: 1,
      },
    });
    expect(wrapper.find('[data-test="resource-value"]').exists()).is.true;
  });
});
