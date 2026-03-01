import {shallowMount} from '@vue/test-utils';
import {globalConfig} from '../getLocalVue';
import {expect} from 'chai';
import CreateGameForm from '@/client/components/create/CreateGameForm.vue';
import ToggleButton from '@/client/components/common/ToggleButton.vue';

describe('CreateGameForm', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(CreateGameForm, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('toggling an expansion button updates the expansion model', async () => {
    const wrapper = shallowMount(CreateGameForm, {...globalConfig});
    const corpEraButton = wrapper.findAllComponents(ToggleButton)
      .find((c) => c.props('name') === 'corporateEra');
    expect(corpEraButton).to.not.be.undefined;
    const initial = corpEraButton!.props('modelValue') as boolean;
    await corpEraButton!.vm.$emit('update:modelValue', !initial);
    expect((wrapper.vm as any).expansions.corpera).to.eq(!initial);
  });
});
